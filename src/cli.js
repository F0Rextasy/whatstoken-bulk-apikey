#!/usr/bin/env node
'use strict';

/**
 * whatstoken-bulk-apikey CLI — mint WhatsTokenAI accounts, one API key per
 * account, and keep only the keys that survived a live chat call.
 *
 * The panel is a TokensByte / tkeapi build of new-api (`/api/v1` for the console
 * API, `/v1` for the relay) behind a China-facing CDN. Registration is
 * **captcha-free** and e-mail only — but the sign-up endpoint is fussy about the
 * address, and the panel counts registrations per IP:
 *
 *   · local part must be `[A-Za-z0-9_]+` — `400 邮箱地址仅允许数字、字母和下划线`
 *     (a Mailtrap inbox `local-tag@<your-mailbox-domain>` is refused for its dash);
 *   · the domain is whitelisted — `400 不支持 @<domain> 域名的邮箱注册`;
 *   · there is a length cap — `400 邮箱地址过长` (long temp.tf plus-aliases fail);
 *   · gmail (Emailnator's dot-free form) passes and is the address family used here;
 *   · one account per contact — `409 CONTACT_AT_LIMIT`
 *     (`该邮箱已绑定 1 个账号，已达上限 1`), the shared public gmail boxes often already taken;
 *   · **one successful registration per IP per day** — `403 当日注册次数已达上限`;
 *   · requesting codes for the same address too often backs off with
 *     `400 验证码发送过于频繁，请稍后再试`.
 *
 * Flow, per account, every panel request through one pinned exit from your pool:
 *   1. mailbox    Emailnator `POST /api/generate-email` → a fresh @gmail.com
 *                 (registered in the dot-free plain form — dots are rejected input)
 *   2. code       `POST /api/v1/auth/send-code` {email, purpose:'register'}
 *   3. read       poll Emailnator (`/api/message-list` → `/api/message/<id>`);
 *                 the panel mails `【WhatsToken.AI】注册验证码` from
 *                 `noreply@<panel-mail>`, 5-minute life
 *   4. register   `POST /api/v1/auth/register-email` {email, code, password, timezone}
 *                 → the session token comes back in the same response
 *   5. wallet     `GET /api/v1/user/wallet` — the sign-up gift (measured 0.1 USD)
 *   6. key        `POST /api/v1/tokens` → the answer field is `token_key`
 *   7. gate       `POST /v1/chat/completions` → 200 with real content = keep
 *
 * A key is appended to `keys.txt` only after step 7 answers 200 with content or
 * reasoning content. Rejected attempts go to `accounts.jsonl` with the reason.
 *
 * Options:
 *   --count N        accounts (= keys) to mint                          [5]
 *   --conc N         accounts in flight at once (keep it at 1)          [1]
 *   --gap MS         pause between accounts                             [2000]
 *   --model <id>     model used for the live gate    [deepseek-v4.1-flash-1017]
 *   --pool <file>    proxy list, one exit per line (env WHATSTOKEN_PROXIES) [optional]
 *   --tries N        exits tried per account before giving up              [3]
 *   --addr-tries N   addresses tried per exit (409/400 address cases)      [4]
 *   --timeout MS     per-request timeout                               [60000]
 *   --verify-only    re-run every key in keys.txt through the chat gate
 *   --screen         only test the proxy list against WhatsTokenAI
 *   --connect-9router  register keys.txt with a local 9Router (published repo)
 *   --help
 *
 * Zero dependencies. Node.js >= 18. Your proxy list is OPTIONAL: pass --pool (or
 * the WHATSTOKEN_PROXIES env) and every request goes through an exit from it,
 * fail-closed — a pool that yields no reachable exit fails the run instead of
 * leaking a request from your own address. Without a pool the tool connects
 * directly, and then the per-IP daily sign-up cap becomes yours.
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const crypto = require('crypto');

const ROOT = path.basename(__dirname) === 'src' ? path.resolve(__dirname, '..') : __dirname;
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.jsonl');
const OUT_DIR = path.join(ROOT, 'out');

const BASE = 'https://www.whatstoken.ai';
const API = `${BASE}/api/v1`;
const EMAILNATOR = 'https://www.emailnator.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
/** The panel's own code mail: brand and sender are both stable (measured). */
const BRAND = /whatstoken|reanimai/i;
const CODE_WORDS = /验证码|校验|注册|verification|verify|activation|your code/i;
const TIMEZONE = process.env.WHATSTOKEN_TIMEZONE || 'Asia/Singapore';

// ------------------------------------------------------------------- options
const argv = process.argv.slice(2);
function arg(name, dflt) {
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return dflt;
}
const has = (name) => argv.includes(`--${name}`) || argv.includes(`-${name}`);

if (has('help') || has('h')) {
  console.log(`whatstoken-bulk-apikey — mint WhatsTokenAI accounts, one key each, verified by a live chat call.

  node src/cli.js --count 5          mint (a key is kept only after a chat 200)
  node src/cli.js --verify-only      re-check every key in keys.txt
  node src/cli.js --screen           test your proxy list against WhatsTokenAI
  node src/cli.js --connect-9router  register keys.txt with a local 9Router
  node src/cli.js --help

  --count N        accounts to mint                                        [5]
  --conc N         accounts in flight (keep it at 1)                       [1]
  --model <id>     model used for the live gate      [deepseek-v4.1-flash-1017]
  --pool <file>    proxy list, one exit per line (env WHATSTOKEN_PROXIES) [optional]
  --addr-tries N   addresses tried per exit (409/400 address cases)         [4]

Requests go through the exits in your proxy list when one is provided (--pool or
the WHATSTOKEN_PROXIES env) and the run FAILS CLOSED if none of them reach the
panel. Without a pool the tool connects DIRECTLY — and WhatsTokenAI allows one
successful registration per IP per day, so a direct run mints at most one key.`);
  process.exit(0);
}

const COUNT = Math.max(1, parseInt(arg('count', '5'), 10) || 5);
const CONC = Math.min(4, Math.max(1, parseInt(arg('conc', '1'), 10) || 1));
const GAP_MS = Math.max(0, parseInt(arg('gap', '2000'), 10) || 0);
const TRIES = Math.max(1, parseInt(arg('tries', '3'), 10) || 3);
const ADDR_TRIES = Math.max(1, parseInt(arg('addr-tries', '4'), 10) || 4);
const TIMEOUT_MS = Math.max(5000, parseInt(arg('timeout', '60000'), 10) || 60000);
const MODEL = arg('model', 'deepseek-v4.1-flash-1017');
const ALT_MODELS = arg('alt-models', 'deepseek-v4.1-flash-1017-special').split(',').map((s) => s.trim()).filter(Boolean);
const VERIFY_ONLY = has('verify-only');
const SCREEN = has('screen');
const CONNECT_ROUTER = has('connect-9router');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);
const randPass = () => `Wt${crypto.randomBytes(6).toString('base64url')}9a`;

// ------------------------------------------------------------------- proxy
function parseProxy(line) {
  const s = String(line || '').trim();
  if (!s || s.startsWith('#')) return null;
  let m = s.match(/^(https?|socks5h?|socks4):\/\/(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)/i);
  if (!m) m = s.match(/^(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)$/);
  if (!m) return null;
  if (m.length === 6) {
    const raw = m[1].toLowerCase();
    if (raw === 'socks4') return null; // socks4 is not supported by this client
    const protocol = raw.startsWith('socks') ? 'socks5' : 'http';
    return { protocol, host: m[4], port: Number(m[5]), auth: m[2] ? `${m[2]}:${m[3]}` : null, line: s };
  }
  return { protocol: 'http', host: m[3], port: Number(m[4]), auth: m[1] ? `${m[1]}:${m[2]}` : null, line: s };
}

/** A raw socket straight to host:port (no proxy) — the direct-mode twin of connectThrough. */
function directConnect(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host, port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`connect timeout (${host}:${port})`)); }, timeoutMs);
    sock.once('error', (e) => { clearTimeout(t); try { sock.destroy(); } catch { /* */ } reject(new Error(`connect failed: ${e.message}`)); });
    sock.once('connect', () => { clearTimeout(t); resolve(sock); });
  });
}

function connectThrough(proxy, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: proxy.host, port: proxy.port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`proxy timeout (${proxy.host}:${proxy.port})`)); }, timeoutMs);
    const done = (err, s) => { clearTimeout(t); if (err) { try { sock.destroy(); } catch { /* */ } reject(err); } else resolve(s); };
    sock.once('error', (e) => done(new Error(`proxy connect failed: ${e.message}`)));
    sock.once('connect', () => {
      if (proxy.protocol === 'socks5') {
        sock.write(proxy.auth ? Buffer.from([5, 2, 0, 2]) : Buffer.from([5, 1, 0]));
        let stage = 0;
        let buf = Buffer.alloc(0);
        const sendConnect = () => {
          const hb = Buffer.from(host);
          sock.write(Buffer.concat([Buffer.from([5, 1, 0, 3, hb.length]), hb, Buffer.from([port >> 8, port & 0xff])]));
        };
        const onData = (d) => {
          try {
            buf = Buffer.concat([buf, d]);
            for (;;) {
              if (stage === 0) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[0] !== 5) return done(new Error('SOCKS5 bad version'));
                if (v[1] === 2) {
                  if (!proxy.auth) return done(new Error('SOCKS5 auth required'));
                  const [u, p] = proxy.auth.split(':');
                  sock.write(Buffer.concat([Buffer.from([1, u.length]), Buffer.from(u), Buffer.from([p.length]), Buffer.from(p)]));
                  stage = 1;
                  continue;
                }
                if (v[1] !== 0) return done(new Error('SOCKS5 no acceptable method'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 1) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[1] !== 0) return done(new Error('SOCKS5 auth failed'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 2) {
                if (buf.length < 5) return;
                const atyp = buf[3];
                const need = 4 + (atyp === 1 ? 4 : atyp === 3 ? 1 + buf[4] : 16) + 2;
                if (buf.length < need) return;
                const rep = buf[1]; buf = buf.slice(need);
                if (rep !== 0) return done(new Error(`SOCKS5 connect failed (code ${rep})`));
                sock.off('data', onData);
                return done(null, sock);
              }
            }
          } catch (e) { done(e); }
        };
        sock.on('data', onData);
        return;
      }
      const auth = proxy.auth ? `Proxy-Authorization: Basic ${Buffer.from(proxy.auth).toString('base64')}\r\n` : '';
      sock.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n${auth}\r\n`);
      let buf = '';
      const onData = (d) => {
        buf += d;
        if (!buf.includes('\r\n\r\n')) return;
        sock.off('data', onData);
        if (!/^HTTP\/\d(\.\d)? 200/.test(buf)) return done(new Error(`proxy CONNECT refused: ${buf.split('\r\n')[0]}`));
        done(null, sock);
      };
      sock.on('data', onData);
    });
  });
}

/** One HTTPS request through one exit. Returns { status, headers, body }. */
async function exitFetch(proxy, url, { method = 'GET', headers = {}, body = null, timeoutMs = TIMEOUT_MS } = {}) {
  const u = new URL(url);
  const raw = proxy ? await connectThrough(proxy, u.hostname, u.port || 443, timeoutMs) : await directConnect(u.hostname, u.port || 443, timeoutMs);
  const sock = tls.connect({ socket: raw, servername: u.hostname });
  await new Promise((res, rej) => { sock.once('secureConnect', res); sock.once('error', rej); });
  const chunks = [];
  let resolve, reject;
  const p = new Promise((res, rej) => { resolve = res; reject = rej; });
  const req = http.request({
    method,
    path: u.pathname + u.search,
    createConnection: () => sock,
    headers: { host: u.host, 'user-agent': UA, accept: '*/*', ...headers },
  });
  const t = setTimeout(() => { try { req.destroy(); } catch { /* */ } reject(new Error('request timeout')); }, timeoutMs);
  req.on('response', (res) => {
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      clearTimeout(t);
      resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') });
    });
  });
  req.on('error', (e) => { clearTimeout(t); reject(e); });
  if (body != null) req.write(Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)));
  req.end();
  return p;
}

async function exitJson(proxy, url, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const body = opts.body;
  if (body != null && !Buffer.isBuffer(body)) headers['content-type'] = 'application/json';
  const r = await exitFetch(proxy, url, { ...opts, headers });
  let json = null;
  try { json = JSON.parse(r.body); } catch { /* not json */ }
  return { status: r.status, json, text: r.body };
}

// ------------------------------------------------------------------- pool
function loadExits() {
  const poolArg = arg('pool', process.env.WHATSTOKEN_PROXIES || 'proxies.txt');
  const poolFile = fs.existsSync(path.resolve(poolArg)) ? path.resolve(poolArg) : path.resolve(ROOT, poolArg);
  if (!fs.existsSync(poolFile)) {
    // No pool = DIRECT mode: the tool still works, but the panel's per-IP daily
    // sign-up cap means a direct run yields at most one account per day.
    console.log(`no proxy list at ${poolFile} — running WITHOUT a proxy (direct). Put exits there (or pass --pool) to route through them.`);
    return [null];
  }
  const exits = fs.readFileSync(poolFile, 'utf8').split(/\r?\n/).map(parseProxy).filter(Boolean);
  if (!exits.length) {
    console.log(`${poolFile} has no usable exits — running WITHOUT a proxy (direct).`);
    return [null];
  }
  return exits;
}

async function screen(exits) {
  let ok = 0;
  const limited = exits.slice(0, 64);
  for (const e of limited) {
    try {
      const t0 = Date.now();
      const r = await exitFetch(e, `${API}/settings`, { timeoutMs: 20000 });
      const good = r.status === 200 && /"registration"/.test(r.body);
      if (good) ok++;
      console.log(`  ${good ? '✔' : '✘'} ${e ? `${e.host}:${e.port}` : 'direct'} status=${r.status} ${Date.now() - t0}ms`);
    } catch (err) {
      console.log(`  ✘ ${e ? `${e.host}:${e.port}` : 'direct'} ${String(err.message).slice(0, 80)}`);
    }
  }
  console.log(`screened ${limited.length} exit(s): ${ok} reach ${BASE}`);
  return ok;
}

// ------------------------------------------------------------------- mail
const stripStyle = (html) => String(html || '').replace(/<style[\s\S]*?<\/style>/gi, ' ');
const stripTags = (html) => stripStyle(html).replace(/<[^>]+>/g, ' ').replace(/&nbsp;?/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Code shapes seen from this panel: a plain `验证码为： 123456` in a
 * letter-spaced `<p>` and the same six digits in the text part. The styled
 * element is checked first because panels that render the code large also ship
 * an image-free body whose first number is the code's neighbour.
 */
function extractCode(subject, text, html) {
  const rawHtml = String(html || '');
  const flat = `${subject || ''} ${text || ''} ${stripTags(rawHtml)}`;
  const styled = rawHtml.match(/letter-spacing\s*:\s*\d+px[^>]*>\s*([A-Za-z0-9]{4,10})\s*</i)
    || rawHtml.match(/font-size\s*:\s*(?:3\d|4[0-5])px[^>]*>\s*([A-Za-z0-9]{4,10})\s*</i);
  if (styled) return styled[1];
  const phrased = flat.match(/(?:验证码|校验码|认证码|verification code|verify code|your code|code)[^\w]{0,12}([A-Za-z0-9]{4,10})/i);
  if (phrased) return phrased[1];
  const digits = flat.match(/(?:^|[^\d])(\d{4,8})(?!\d)/);
  return digits ? digits[1] : null;
}

async function newMailbox(exit) {
  const r = await exitJson(exit, `${EMAILNATOR}/api/generate-email`, {
    method: 'POST',
    body: { ids: [3] },
    headers: { origin: EMAILNATOR, referer: `${EMAILNATOR}/` },
  });
  const dotted = r.json && r.json.email;
  if (!dotted || !/@gmail\.com$/i.test(dotted)) throw new Error(`emailnator generate ${r.status}: ${String(r.text).slice(0, 120)}`);
  const [local, domain] = dotted.split('@');
  // The panel only accepts [A-Za-z0-9_]+ in the local part, so the dot-free form
  // is what gets registered — Gmail treats both as the same mailbox.
  return { dotted, plain: `${local.replace(/\./g, '')}@${domain}` };
}

/** Ids already sitting in a shared public inbox: only mail that arrives after the request counts. */
async function inboxBaseline(exit, box) {
  try {
    const r = await exitJson(exit, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: box.plain, limit: 20 } });
    return new Set(((r.json && r.json.messages) || []).map((m) => String(m.id)));
  } catch { return new Set(); }
}

async function pollCode(exit, box, baseline, { timeoutMs = 150000, pollMs = 5000 } = {}) {
  const seen = new Set(baseline);
  const pool = [];
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    let msgs = [];
    try {
      const r = await exitJson(exit, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: box.plain, limit: 20 } });
      msgs = (r.json && r.json.messages) || [];
    } catch { /* retry */ }
    for (const m of msgs) {
      const id = String(m.id);
      if (seen.has(id)) continue;
      seen.add(id);
      const head = `${m.from || ''} ${m.subject || ''}`;
      if (!BRAND.test(head) && !CODE_WORDS.test(head)) continue;
      const r = await exitJson(exit, `${EMAILNATOR}/api/message/${encodeURIComponent(id)}`).catch(() => null);
      const html = r ? r.body : '';
      const code = extractCode(m.subject, stripTags(html), html);
      if (!code) continue;
      if (BRAND.test(head)) return code;
      pool.push(code);   // someone else's promo: usable only if nothing branded arrives
    }
    await sleep(pollMs);
  }
  if (pool.length) return pool[0];
  throw new Error('no verification code inside the window');
}

// ------------------------------------------------------------------- flows
function readKeys() {
  try { return fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean); } catch { return []; }
}
function appendKey(key) { fs.appendFileSync(KEYS_FILE, (fs.existsSync(KEYS_FILE) && fs.statSync(KEYS_FILE).size ? '\n' : '') + key + '\n'); }
function recordAccount(rec) { fs.appendFileSync(ACCOUNTS_FILE, JSON.stringify(rec) + '\n'); }

const errOf = (r) => {
  const e = (r.json && r.json.error) || {};
  return { code: String(e.error_code || ''), msg: String(e.message || '') };
};

/** Register one account through `exit`. Throws 'EXIT_USED' when this IP has spent its daily sign-up. */
async function signUp(exit) {
  const r = await exitJson(exit, `${API}/settings`);
  const gates = (r.json && r.json.registration) || {};
  if (r.status === 200 && gates.enable_email_registration === false) throw new Error('e-mail registration is disabled on the panel right now');
  if (r.json && r.json.marketing && r.json.marketing.enable_registration_gift === false) log('note: the sign-up gift is currently OFF — new accounts will have zero balance');

  let address = null;
  let password = randPass();
  let token = null;
  let lastReason = '';

  for (let a = 0; a < ADDR_TRIES && !token; a++) {
    const box = await newMailbox(exit);
    address = box.plain;
    password = randPass();
    const baseline = await inboxBaseline(exit, box);

    const sent = await exitJson(exit, `${API}/auth/send-code`, { method: 'POST', body: { email: address, purpose: 'register' } });
    if (sent.status !== 200) {
      lastReason = `send-code ${sent.status} ${errOf(sent).msg}`;
      log(`  address ${address}: ${lastReason}`);
      if (/频繁|too frequent/i.test(errOf(sent).msg)) await sleep(30000);
      continue;
    }

    let code = null;
    try { code = await pollCode(exit, box, baseline); } catch (e) { log(`  address ${address}: ${e.message}`); continue; }

    const reg = await exitJson(exit, `${API}/auth/register-email`, {
      method: 'POST',
      body: { email: address, code, password, timezone: TIMEZONE },
    });
    const e = errOf(reg);
    if (/上限|limit/i.test(e.msg) && /注册/.test(e.msg)) throw new Error('EXIT_USED');      // 403 当日注册次数已达上限
    if (reg.status === 200) {
      token = (reg.json && (reg.json.token || (reg.json.data && reg.json.data.token))) || null;
      if (!token) throw new Error(`register 200 without a session token: ${String(reg.text).slice(0, 140)}`);
      break;
    }
    lastReason = `register ${reg.status} ${e.code || ''} ${e.msg}`.trim();
    log(`  address ${address}: ${lastReason}`);
    // 409 CONTACT_AT_LIMIT / 400 bad-or-used code: address-side, same exit, new mailbox.
  }
  if (!token) throw new Error(lastReason || 'registration failed');

  const auth = { Authorization: `Bearer ${token}` };
  const wallet = ((await exitJson(exit, `${API}/user/wallet`, { headers: auth })).json) || {};
  const profile = ((await exitJson(exit, `${API}/user/profile`, { headers: auth })).json) || {};

  const created = await exitJson(exit, `${API}/tokens`, {
    method: 'POST',
    headers: auth,
    body: {
      name: `k-${crypto.randomBytes(3).toString('hex')}`,
      quota_limit: -1, daily_quota_limit: -1, weekly_quota_limit: -1, monthly_quota_limit: -1,
      rps_limit: 0, rpm_limit: 0, allowed_ips: '', only_playground: 0, only_playground_2026: 0,
      high_availability: 0, allowed_models: [], expired_time: -1,
    },
  });
  const t = created.json || {};
  const key = t.token_key || t.key || (t.data && (t.data.token_key || t.data.key)) || null;
  if (!key) throw new Error(`token create ${created.status}: ${String(created.text).slice(0, 140)}`);
  return { email: address, password, token, key, uid: profile.uid || null, tokenId: t.id || null, giftBalance: wallet.gift_balance ?? null };
}

async function chatGate(exit, key, model) {
  const r = await exitJson(exit, `${BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}` },
    body: { model, messages: [{ role: 'user', content: 'reply with the single word: pong' }], max_tokens: 32 },
  });
  const msg = r.json && r.json.choices && r.json.choices[0] && r.json.choices[0].message;
  const ok = r.status === 200 && !!(msg && ((msg.content && msg.content.length) || (msg.reasoning_content && msg.reasoning_content.length)));
  return { ok, status: r.status, sample: String(r.text).slice(0, 140) };
}

/** The daily sign-up cap is per IP: an exit that reports it is dead for the rest of the day. */
const burnedExits = new Set();

async function mint() {
  const exits = loadExits();
  if (SCREEN) return void (await screen(exits));
  log(`whatstoken · ${COUNT} key(s) · conc ${CONC} · exits ${exits.filter(Boolean).length || 'direct'} · keys land in ${KEYS_FILE}`);
  let made = 0;
  for (let i = 0; i < COUNT; i += CONC) {
    const jobs = [];
    for (let k = 0; k < CONC && i + k < COUNT; k++) {
      const index = i + k;
      jobs.push((async () => {
        let lastErr = null;
        for (let t = 0; t < TRIES; t++) {
          const pool = exits.filter((e) => !burnedExits.has(e ? e.line : 'direct'));
          if (!pool.length) { lastErr = new Error('every exit in the pool has spent its daily registration'); break; }
          const exit = pool[(index + t) % pool.length];
          try {
            const rec = await signUp(exit);
            let live = null;
            let gate = null;
            for (const model of [MODEL, ...ALT_MODELS]) {
              gate = await chatGate(exit, rec.key, model);
              if (gate.ok) { live = model; break; }
            }
            const base = {
              at: new Date().toISOString(), email: rec.email, password: rec.password, uid: rec.uid,
              token_id: rec.tokenId, gift_balance: rec.giftBalance,
              exit: exit ? `${exit.host}:${exit.port}` : 'direct',
            };
            if (!live) {
              recordAccount({ ...base, key_masked: `${rec.key.slice(0, 8)}…`, gate: gate ? gate.status : null, kept: false });
              lastErr = new Error(`chat gate ${gate ? gate.status : '?'}: ${gate ? gate.sample : ''}`);
              continue;
            }
            appendKey(rec.key);
            recordAccount({ ...base, base_url: `${BASE}/v1`, model: live, gate: 200, kept: true });
            made++;
            log(`account ${index + 1} ✔ chat-200 ${live} · gift ${rec.giftBalance ?? '?'} · ${rec.key.slice(0, 8)}…`);
            return;
          } catch (e) {
            lastErr = e;
            if (e.message === 'EXIT_USED') { burnedExits.add(exit ? exit.line : 'direct'); log(`exit ${exit ? `${exit.host}:${exit.port}` : 'direct'} — daily registration cap reached, next exit`); }
          }
        }
        log(`account ${index + 1}: ${lastErr ? String(lastErr.message).slice(0, 140) : 'failed'}`);
      })());
    }
    await Promise.all(jobs);
    if (GAP_MS) await sleep(GAP_MS);
  }
  log(`done — ${made}/${COUNT} key(s) written to ${KEYS_FILE}`);
  if (made < COUNT) process.exitCode = 1;
}

async function verifyOnly() {
  const exits = loadExits();
  const keys = readKeys();
  if (!keys.length) { console.log(`no keys in ${KEYS_FILE}`); process.exit(0); }
  let live = 0;
  for (let i = 0; i < keys.length; i++) {
    const exit = exits[i % exits.length];
    try {
      const g = await chatGate(exit, keys[i], MODEL);
      if (g.ok) live++;
      console.log(`  ${g.ok ? '✔' : '✘'} ${keys[i].slice(0, 8)}… chat=${g.status}`);
    } catch (e) {
      console.log(`  ✘ ${keys[i].slice(0, 8)}… ${String(e.message).slice(0, 90)}`);
    }
  }
  console.log(`verify: ${live}/${keys.length} keys live on ${MODEL}`);
  process.exit(live === keys.length ? 0 : 1);
}

/** Register keys.txt with a local 9Router. The connector ships with the published repo. */
async function connectRouter() {
  let mod;
  try { mod = require('./connect-9router.js'); }
  catch {
    console.error('connect-9router.js is not next to this CLI — run --connect-9router from the published repo (src/cli.js).');
    process.exit(1);
  }
  const keys = readKeys();
  if (!keys.length) { console.error(`no keys in ${KEYS_FILE} — mint some first.`); process.exit(1); }
  await mod.connectKeysFile({
    keysFile: KEYS_FILE,
    base: arg('base', undefined),
    password: arg('password', undefined),
    apiKey: arg('api-key', undefined),
  });
}

(CONNECT_ROUTER ? connectRouter() : VERIFY_ONLY ? verifyOnly() : mint())
  .catch((e) => { console.error('[fatal]', e.message); process.exit(1); });
