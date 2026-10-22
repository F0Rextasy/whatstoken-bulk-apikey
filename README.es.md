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

**Crea cuentas de WhatsTokenAI en masa con claves API autogeneradas — inferencia compatible con OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-141-of-them) · [🧪 Usa la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

WhatsTokenAI es una build de new-api de TokensByte / tkeapi detrás de un CDN orientado a China. El registro es **sin captcha y solo por correo electrónico** (`enable_username_registration: false`, `enable_email_registration: true`, sin Turnstile/hCaptcha/Geetest en ningún lugar del bundle de la consola), el módulo de marketing entrega a cada cuenta nueva un **regalo de registro (medido en 0.1 USD de `gift_balance`)**, y la API del panel responde a un `GET /api/v1/settings` público sobre el que puedes condicionar. La herramienta completa se demostró de extremo a extremo acuñando **10 cuentas → 10 claves verificadas**, y luego volviendo a demostrar las diez desde una red diferente.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Regalo de registro | **0.1 USD de `gift_balance` por cuenta** (`balance 0.0`; `marketing.enable_registration_gift: true`, `invite_reward_invitee: 0.1`) |
| Puerta de registro | correo electrónico + código de 6 dígitos — **sin captcha**; el registro por nombre de usuario y móvil está desactivado |
| Política de direcciones | parte local solo `[A-Za-z0-9_]+`, dominio en lista blanca, límite de longitud → **gmail es la familia de direcciones que pasa** |
| Una cuenta por contacto | `409 CONTACT_AT_LIMIT` — los buzones públicos compartidos de gmail suelen estar ya ocupados |
| Registros por IP | **1 registro exitoso por IP por día** — `403 当日注册次数已达上限` |
| Reenvío de código | enfriamiento por dirección — `400 验证码发送过于频繁，请稍后再试` |
| La unidad que escala | **una cuenta = una clave = una salida** (con un pool; una ejecución directa acuña una por día) |

> 💡 El nivel gratuito lo define WhatsToken y puede cambiar. Consulta los números en vivo en [www.whatstoken.ai](https://www.whatstoken.ai) — y deja que la propia puerta de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 141

El catálogo público contiene **141 entradas de modelos en 88 grupos** repartidas en 5 categorías (chat / imagen / vídeo / audio / mejora de vídeo). La línea de clave verificada es la familia flash de DeepSeek:

| ID del modelo | Verificado |
| --- | --- |
| `deepseek-v4.1-flash-1017` | **10 claves chat-200** en `providers/whatstoken/keys.txt`; barrido completo desde una segunda red (ver la tabla de Verificado) |
| `deepseek-v4.1-flash-1017-special` | chat-200 con las mismas claves (el hermano con descuento) |

El upstream responde con el id interno `deepseek-v4-1-flash-261017`, así que un router que pliegue alias debería mapear ambos de vuelta a la familia base `deepseek-v4.1-flash`.

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Cómo usar la API

URL base **`https://www.whatstoken.ai/v1`** — compatible con OpenAI. El ápice `whatstoken.ai` solo redirige (`301`) y `api.whatstoken.ai` no resuelve, así que mantén el host `www` en tu cliente.

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 Inicio rápido

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router

# or: node src/cli.js --count 30 --pool proxies.txt
```

Una clave se escribe en `keys.txt` **solo** después de que `/v1/chat/completions` responda 200 con contenido real o contenido de razonamiento; `accounts.jsonl` guarda correo electrónico / contraseña / uid / id de token / saldo de regalo / salida / modelo, y los intentos rechazados conservan su motivo.

### 🖱️ El lanzador

El lanzador pide la lista de proxies y la cantidad, las recuerda en `launcher.config.json` y ejecuta el CLI — acuñar, verificar, cribar salidas, ajustes, ayuda, Conectar a 9Router.

## ✅ Verificado funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `GET /api/v1/settings` | **200** — registro activado, registro por correo activado, nombre de usuario/móvil desactivados, sin captcha, regalo de registro activado |
| `POST /api/v1/auth/send-code` | **200** — el panel envía por correo `【WhatsToken.AI】注册验证码` desde `noreply@<panel-mail>` en ~5–10 s (vida de 5 minutos) |
| `POST /api/v1/auth/register-email` | **200** — token de sesión en la misma respuesta; `403 当日注册次数已达上限` una vez que esa IP ha tenido su registro diario |
| `POST /api/v1/tokens` | **200** — la clave vuelve como `token_key` (no `key`), cuota ilimitada |
| `POST /v1/chat/completions` (`deepseek-v4.1-flash-1017`) — para **cada** clave antes de escribirse | **200** con contenido real — la acuñación de 10 claves se completó a 10/10 |
| reverificación independiente — **10/10 claves vivas** desde una salida diferente (`--verify-only`, `deepseek-v4.1-flash-1017`, 2026-10-20) | las diez claves PASAN; el modelo hermano `-special` también responde 200 |
| notas del lado del panel | los registros están limitados **por IP por día**; un código incorrecto/caducado primero quema la dirección (`400 邮箱验证码无效`), no la salida |

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| puertas | `GET /api/v1/settings` | interruptores de registro/marketing, sin auth |
| buzón | Emailnator `POST /api/generate-email` | un @gmail.com nuevo por cuenta, registrado en la forma sin puntos |
| enviar código | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | el enfriamiento responde `验证码发送过于频繁` |
| leer código | Emailnator `/api/message-list` → `/api/message/<id>` | primero la marca (`WhatsToken`/`reanimai`), luego una llegada con forma de código desde la instantánea |
| registrar | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → nueva dirección, misma salida; `403 当日注册次数已达上限` → siguiente salida |
| clave | `POST /api/v1/tokens` | cuota ilimitada; campo de respuesta `token_key` |
| prueba | `POST /v1/chat/completions` | 200 con contenido/contenido de razonamiento = la clave está viva |

## ⚙️ Opciones del CLI

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Por defecto | Significado |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | pool de salidas, una línea por proxy |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | `timezone` enviado a la llamada de registro |

El CLI mantiene `--conc` por completitud pero usa **1** por defecto: el registro está limitado por IP por día, así que las cuentas en paralelo solo compiten por la misma cuota.

## 🛰️ Detrás de un proxy

**Opcional — pero el proveedor lo hace casi obligatorio a cualquier escala.** La herramienta también funciona sin proxy.

- **Con un pool:** pasa `--pool <file>` (o define `WHATSTOKEN_PROXIES`) y cada petición de una cuenta — send-code, register, wallet, key, chat-200 — pasa por una salida fijada de esa lista, de modo que el código nunca se emite desde una dirección y se canjea desde otra. Una salida fallida mueve el intento a la siguiente; una salida que reporta `403 当日注册次数已达上限` se quema durante el resto de la ejecución. Con un pool la ejecución es **fail-closed**: si ninguna salida alcanza el panel, la ejecución falla en lugar de filtrar una petición desde tu propia dirección.
- **Sin un pool:** el CLI imprime `running WITHOUT a proxy (direct)` y se conecta directamente — y entonces la regla de WhatsTokenAI de un registro por IP por día significa que una ejecución directa acuña **una** clave.
- Ejecuta `--screen` contra cualquiera de los dos modos: prueba las salidas que tengas (o la ruta directa) contra `GET /api/v1/settings` antes de una ejecución real.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.jsonl` | correo electrónico / contraseña / uid / id de token / saldo de regalo / salida / modelo / puerta — ignorado por git |
| `proxies.txt` | tus salidas — ignorado por git |
| `out/` | registros de ejecución — ignorado por git |

## 🔌 Conectar a 9Router

[9Router](https://9router.com) es un router autoalojado y compatible con OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

Por defecto: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Los modelos se sirven como `whatstoken/<model id>`.

## 🔌 Conectar a OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado y compatible con OpenAI:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-omniroute      # same, from the CLI
```

Por defecto: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Los modelos se sirven como `whatstoken/<model id>`.
## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 Qué da el proveedor | $0.1 de `gift_balance` al registrarte (registro por correo sin captcha) |
| 🔑 Qué te da una clave | una clave en su propia cuenta, verificada por chat en `deepseek-v4.1-flash-1017` |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con `www.whatstoken.ai` y tu backend de buzón |

## 🐞 Problemas

Si WhatsTokenAI cambia sus puertas de registro, su política de direcciones o el regalo de registro, la herramienta se detiene en ese paso e indica cuál. **[Abre un issue](../../issues)** con el comando y la salida exacta.

## 📄 Licencia

MIT © 2026 — ver [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>