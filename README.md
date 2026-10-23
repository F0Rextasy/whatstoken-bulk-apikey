<div align="center">

```
██╗    ██╗██╗  ██╗ █████╗ ████████╗███████╗████████╗ ██████╗ ██╗  ██╗███████╗
██║    ██║██║  ██║██╔══██╗╚══██╔══╝██╔════╝╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝
██║ █╗ ██║███████║███████║   ██║   ███████╗   ██║   ██║   ██║█████╔╝ █████╗
██║███╗██║██╔══██║██╔══██║   ██║   ╚════██║   ██║   ██║   ██║██╔═██╗ ██╔══╝
╚███╔███╔╝██║  ██║██║  ██║   ██║   ███████║   ██║   ╚██████╔╝██║  ██╗███████╗
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝

███╗   ██╗
████╗  ██║
██╔██╗ ██║
██║╚██╗██║
██║ ╚████║
╚═╝  ╚═══╝
```

# whatstoken-bulk-apikey

**Bulk-create WhatsTokenAI accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-141-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

WhatsTokenAI is a TokensByte / tkeapi build of new-api behind a China-facing CDN. Registration is **captcha-free and e-mail only** (`enable_username_registration: false`, `enable_email_registration: true`, no Turnstile/hCaptcha/Geetest anywhere in the console bundle), the marketing module hands every new account a **sign-up gift (measured 0.1 USD `gift_balance`)**, and the panel API answers a public `GET /api/v1/settings` you can gate on. The whole tool was proven end-to-end by minting **10 accounts → 10 verified keys**, then re-proving all ten from a different network.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Sign-up gift | **0.1 USD `gift_balance` per account** (`balance 0.0`; `marketing.enable_registration_gift: true`, `invite_reward_invitee: 0.1`) |
| Signup gate | e-mail + 6-digit code — **no captcha**; username and mobile registration are switched off |
| Address policy | local part `[A-Za-z0-9_]+` only, whitelisted domain, length cap → **gmail is the address family that passes** |
| One account per contact | `409 CONTACT_AT_LIMIT` — the shared public gmail boxes are often already taken |
| Registrations per IP | **1 successful sign-up per IP per day** — `403 当日注册次数已达上限` |
| Code resend | per-address cooldown — `400 验证码发送过于频繁，请稍后再试` |
| The unit that scales | **one account = one key = one exit** (with a pool; a direct run mints one per day) |

> 💡 The free tier is set by WhatsToken and can change. Check the live numbers at [www.whatstoken.ai](https://www.whatstoken.ai) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 141 of them

The public catalogue carries **141 model entries in 88 groups** across 5 categories (chat / image / video / audio / video-enhance). The verified key line is DeepSeek's flash family:

| Model ID | Verified |
| --- | --- |
| `deepseek-v4.1-flash-1017` | **every key, chat-200** in `providers/whatstoken/keys.txt`; full sweep from a second network (see the Verified table) |
| `deepseek-v4.1-flash-1017-special` | chat-200 with the same keys (the discounted sibling) |

Upstream answers with the internal id `deepseek-v4-1-flash-261017`, so a router that folds aliases should map both back to the base `deepseek-v4.1-flash` family.

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 How to use the API

Base URL **`https://www.whatstoken.ai/v1`** — OpenAI-compatible. The apex `whatstoken.ai` only redirects (`301`) and `api.whatstoken.ai` does not resolve, so keep the `www` host in your client.

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 Quick start

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router
# or: node src/cli.js --count 30 --pool proxies.txt
```

A key is written to `keys.txt` **only** after `/v1/chat/completions` answers 200 with real content or reasoning content; `accounts.jsonl` keeps e-mail / password / uid / token id / gift balance / exit / model, and rejected attempts keep their reason.

### 🖱️ The launcher

The launcher asks for the proxy list and count, remembers them in `launcher.config.json`, and runs the CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Verified working — every key is tested

| Check | Result |
| --- | --- |
| `GET /api/v1/settings` | **200** — register on, e-mail registration on, username/mobile off, no captcha, sign-up gift on |
| `POST /api/v1/auth/send-code` | **200** — the panel mails `【WhatsToken.AI】注册验证码` from `noreply@<panel-mail>` within ~5–10 s (5-minute life) |
| `POST /api/v1/auth/register-email` | **200** — session token in the same response; `403 当日注册次数已达上限` once that IP has had its daily sign-up |
| `POST /api/v1/tokens` | **200** — the key comes back as `token_key` (not `key`), unlimited quota |
| `POST /v1/chat/completions` (`deepseek-v4.1-flash-1017`) — for **every** key before it is written | **200** with real content — the 10-key mint completed at 10/10 |
| independent re-check — **every key verified** from a different exit (`--verify-only`, `deepseek-v4.1-flash-1017`, 2026-10-20) | all ten keys PASS; the sibling `-special` model also answers 200 |
| panel-side notes | registrations are capped **per IP per day**; a bad/expired code first burns the address (`400 邮箱验证码无效`), not the exit |

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Re-run the verify step any time;
> failures are reported, never hidden.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| gates | `GET /api/v1/settings` | registration/marketing switches, no auth |
| mailbox | Emailnator `POST /api/generate-email` | one fresh @gmail.com per account, registered in the dot-free form |
| send code | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | cooldown answers `验证码发送过于频繁` |
| read code | Emailnator `/api/message-list` → `/api/message/<id>` | brand-first (`WhatsToken`/`reanimai`), then a code-shaped arrival from the snapshot |
| register | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → new address, same exit; `403 当日注册次数已达上限` → next exit |
| key | `POST /api/v1/tokens` | unlimited quota; answer field `token_key` |
| proof | `POST /v1/chat/completions` | 200 with content/reasoning content = the key is live |

## ⚙️ CLI options

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Default | Meaning |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | exit pool, one line per proxy |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | `timezone` sent to the register call |

The CLI keeps `--conc` for completeness but defaults to **1**: registration is capped per IP per day, so parallel accounts only race for the same quota.

## 🛰️ Behind a proxy

**Optional — but the provider makes it nearly mandatory at any scale.** The tool works without a proxy too.

- **With a pool:** pass `--pool <file>` (or set `WHATSTOKEN_PROXIES`) and every request for an account — send-code, register, wallet, key, chat-200 — goes through one pinned exit from that list, so the code is never issued by one address and redeemed by another. A failed exit moves the attempt to the next one; an exit that reports `403 当日注册次数已达上限` is burned for the rest of the run. With a pool the run is **fail-closed**: if no exit reaches the panel the run fails instead of leaking a request from your own address.
- **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)` and connects directly — and then WhatsTokenAI's one-sign-up-per-IP-per-day rule means a direct run mints **one** key.
- Run `--screen` against either mode: it tests the exits you have (or the direct route) against `GET /api/v1/settings` before a real run.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.jsonl` | e-mail / password / uid / token id / gift balance / exit / model / gate — git-ignored |
| `proxies.txt` | your exits — git-ignored |
| `out/` | run logs — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

Defaults: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Models are served as `whatstoken/<model id>`.

## 🔌 Connect to OmniRoute

[OmniRoute](https://omniroute.online) is a self-hosted, OpenAI-compatible router:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-omniroute      # same, from the CLI
```

Defaults: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Models are served as `whatstoken/<model id>`.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 What the provider gives | $0.1 `gift_balance` on signup (captcha-free e-mail signup) |
| 🔑 What one key gets you | one key on its own account, chat-verified on `deepseek-v4.1-flash-1017` |
| 🌐 API shape | OpenAI-compatible: `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 Your data | only `www.whatstoken.ai` and your inbox backend are contacted |

## 🐞 Issues

If WhatsTokenAI changes its register gates, its address policy or the sign-up gift, the tool stops at that step and says which one. **[Open an issue](../../issues)** with the command and the exact output.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>
