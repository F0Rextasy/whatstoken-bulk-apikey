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

**WhatsTokenAI-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-141-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

WhatsTokenAI ist ein TokensByte-/tkeapi-Build von new-api hinter einem CDN für China. Die Registrierung ist **captcha-frei und nur per E-Mail** (`enable_username_registration: false`, `enable_email_registration: true`, kein Turnstile/hCaptcha/Geetest irgendwo im Console-Bundle), das Marketing-Modul überreicht jedem neuen Konto ein **Anmeldegeschenk (gemessen 0,1 USD `gift_balance`)**, und die Panel-API beantwortet ein öffentliches `GET /api/v1/settings`, auf das du dich stützen kannst. Das gesamte Tool wurde Ende-zu-Ende bewiesen, indem **10 Konten → 10 verifizierte Schlüssel** erzeugt wurden, und dann alle zehn aus einem anderen Netzwerk erneut bewiesen.

## 🎁 Kostenlose Stufe — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Anmeldegeschenk | **0,1 USD `gift_balance` pro Konto** (`balance 0.0`; `marketing.enable_registration_gift: true`, `invite_reward_invitee: 0.1`) |
| Registrierungs-Gate | E-Mail + 6-stelliger Code — **kein Captcha**; Benutzername- und Mobilfunk-Registrierung sind abgeschaltet |
| Adressrichtlinie | lokaler Teil nur `[A-Za-z0-9_]+`, Domain auf Whitelist, Längenbegrenzung → **gmail ist die Adressfamilie, die durchkommt** |
| Ein Konto pro Kontakt | `409 CONTACT_AT_LIMIT` — die geteilten öffentlichen gmail-Postfächer sind oft schon belegt |
| Registrierungen pro IP | **1 erfolgreiche Anmeldung pro IP pro Tag** — `403 当日注册次数已达上限` |
| Code erneut senden | Cooldown pro Adresse — `400 验证码发送过于频繁，请稍后再试` |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel = ein Exit** (mit einem Pool; ein direkter Lauf erzeugt einen pro Tag) |

> 💡 Die kostenlose Stufe wird von WhatsToken festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [www.whatstoken.ai](https://www.whatstoken.ai) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 141 davon

Der öffentliche Katalog enthält **141 Modelleinträge in 88 Gruppen** über 5 Kategorien (chat / image / video / audio / video-enhance). Die verifizierte Schlüsselzeile ist die Flash-Familie von DeepSeek:

| Modell-ID | Verifiziert |
| --- | --- |
| `deepseek-v4.1-flash-1017` | **10 Schlüssel chat-200** in `providers/whatstoken/keys.txt`; vollständiger Durchlauf aus einem zweiten Netzwerk (siehe Verifiziert-Tabelle) |
| `deepseek-v4.1-flash-1017-special` | chat-200 mit denselben Schlüsseln (das rabattierte Geschwistermodell) |

Upstream antwortet mit der internen ID `deepseek-v4-1-flash-261017`, daher sollte ein Router, der Aliase zusammenführt, beide zurück auf die Basis-Familie `deepseek-v4.1-flash` abbilden.

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 So verwendest du die API

Basis-URL **`https://www.whatstoken.ai/v1`** — OpenAI-kompatibel. Das Apex `whatstoken.ai` leitet nur weiter (`301`) und `api.whatstoken.ai` löst nicht auf, behalte also den `www`-Host in deinem Client.

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 Schnellstart

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router

# or: node src/cli.js --count 30 --pool proxies.txt
```

Ein Schlüssel wird **nur** dann in `keys.txt` geschrieben, wenn `/v1/chat/completions` mit 200 und echtem Inhalt oder Reasoning-Inhalt antwortet; `accounts.jsonl` behält E-Mail / Passwort / uid / Token-ID / Geschenkguthaben / Exit / Modell, und abgelehnte Versuche behalten ihren Grund.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste und der Anzahl, merkt sie sich in `launcher.config.json` und führt die CLI aus — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET /api/v1/settings` | **200** — Registrierung an, E-Mail-Registrierung an, Benutzername/Mobil aus, kein Captcha, Anmeldegeschenk an |
| `POST /api/v1/auth/send-code` | **200** — das Panel mailt `【WhatsToken.AI】注册验证码` von `noreply@<panel-mail>` innerhalb von ~5–10 s (5 Minuten Lebensdauer) |
| `POST /api/v1/auth/register-email` | **200** — Session-Token in derselben Antwort; `403 当日注册次数已达上限`, sobald diese IP ihre tägliche Anmeldung hatte |
| `POST /api/v1/tokens` | **200** — der Schlüssel kommt als `token_key` zurück (nicht `key`), unbegrenztes Kontingent |
| `POST /v1/chat/completions` (`deepseek-v4.1-flash-1017`) — für **jeden** Schlüssel, bevor er geschrieben wird | **200** mit echtem Inhalt — der 10-Schlüssel-Mint wurde mit 10/10 abgeschlossen |
| unabhängige Nachprüfung — **10/10 Schlüssel live** von einem anderen Exit (`--verify-only`, `deepseek-v4.1-flash-1017`, 2026-10-20) | alle zehn Schlüssel PASS; das Geschwistermodell `-special` antwortet ebenfalls mit 200 |
| Hinweise von der Panel-Seite | Registrierungen sind **pro IP pro Tag** begrenzt; ein falscher/abgelaufener Code verbrennt zuerst die Adresse (`400 邮箱验证码无效`), nicht den Exit |

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Gates | `GET /api/v1/settings` | Registrierungs-/Marketing-Schalter, keine Auth |
| Postfach | Emailnator `POST /api/generate-email` | eine frische @gmail.com pro Konto, in der punktfreien Form registriert |
| Code senden | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | Cooldown antwortet `验证码发送过于频繁` |
| Code lesen | Emailnator `/api/message-list` → `/api/message/<id>` | Marke zuerst (`WhatsToken`/`reanimai`), dann eine code-förmige Ankunft aus dem Snapshot |
| Registrieren | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → neue Adresse, gleicher Exit; `403 当日注册次数已达上限` → nächster Exit |
| Schlüssel | `POST /api/v1/tokens` | unbegrenztes Kontingent; Antwortfeld `token_key` |
| Beweis | `POST /v1/chat/completions` | 200 mit Inhalt/Reasoning-Inhalt = der Schlüssel ist live |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Standard | Bedeutung |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | Exit-Pool, eine Zeile pro Proxy |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | `timezone`, die an den Register-Aufruf gesendet wird |

Die CLI behält `--conc` der Vollständigkeit halber bei, verwendet aber standardmäßig **1**: Die Registrierung ist pro IP pro Tag begrenzt, daher konkurrieren parallele Konten nur um dasselbe Kontingent.

## 🛰️ Hinter einem Proxy

**Optional — aber der Anbieter macht es in jedem Maßstab nahezu zwingend.** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** übergib `--pool <file>` (oder setze `WHATSTOKEN_PROXIES`) und jede Anfrage für ein Konto — send-code, register, wallet, key, chat-200 — geht durch einen fest zugewiesenen Exit aus dieser Liste, sodass der Code nie von einer Adresse ausgegeben und von einer anderen eingelöst wird. Ein fehlgeschlagener Exit verschiebt den Versuch auf den nächsten; ein Exit, der `403 当日注册次数已达上限` meldet, wird für den Rest des Laufs verbrannt. Mit einem Pool ist der Lauf **fail-closed**: Wenn kein Exit das Panel erreicht, schlägt der Lauf fehl, statt eine Anfrage von deiner eigenen Adresse durchsickern zu lassen.
- **Ohne einen Pool:** die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet direkt — und dann bedeutet WhatsTokenAIs Regel von einer Anmeldung pro IP pro Tag, dass ein direkter Lauf **einen** Schlüssel erzeugt.
- Führe `--screen` gegen beide Modi aus: Es testet die Exits, die du hast (oder die direkte Route) gegen `GET /api/v1/settings`, bevor ein echter Lauf startet.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von git ignoriert |
| `accounts.jsonl` | E-Mail / Passwort / uid / Token-ID / Geschenkguthaben / Exit / Modell / Gate — von git ignoriert |
| `proxies.txt` | deine Exits — von git ignoriert |
| `out/` | Lauf-Logs — von git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

Standardwerte: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Modelle werden als `whatstoken/<model id>` bereitgestellt.

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-omniroute      # same, from the CLI
```

Standardwerte: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Modelle werden als `whatstoken/<model id>` bereitgestellt.
## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 Was der Anbieter gibt | 0,1 $ `gift_balance` bei der Anmeldung (captcha-freie E-Mail-Anmeldung) |
| 🔑 Was ein Schlüssel dir bringt | ein Schlüssel auf seinem eigenen Konto, chat-verifiziert auf `deepseek-v4.1-flash-1017` |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 Deine Daten | nur `www.whatstoken.ai` und dein Postfach-Backend werden kontaktiert |

## 🐞 Probleme

Wenn WhatsTokenAI seine Registrierungs-Gates, seine Adressrichtlinie oder das Anmeldegeschenk ändert, stoppt das Tool an diesem Schritt und sagt, an welchem. **[Öffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>