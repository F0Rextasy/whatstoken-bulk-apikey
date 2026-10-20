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

**Массовое создание аккаунтов WhatsTokenAI с автоматически сгенерированными API-ключами — вывод, совместимый с OpenAI, + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-141-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

WhatsTokenAI — это сборка TokensByte / tkeapi на базе new-api за CDN, ориентированным на Китай. Регистрация **без капчи и только по e-mail** (`enable_username_registration: false`, `enable_email_registration: true`, никаких Turnstile/hCaptcha/Geetest нигде в бандле консоли), маркетинговый модуль выдаёт каждому новому аккаунту **подарок за регистрацию (измерено 0.1 USD `gift_balance`)**, а API панели отвечает на публичный `GET /api/v1/settings`, по которому можно ставить условие. Весь инструмент был проверен от начала до конца путём создания **10 аккаунтов → 10 проверенных ключей**, а затем повторно подтверждён для всех десяти из другой сети.

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Подарок за регистрацию | **0.1 USD `gift_balance` на аккаунт** (`balance 0.0`; `marketing.enable_registration_gift: true`, `invite_reward_invitee: 0.1`) |
| Условие регистрации | e-mail + 6-значный код — **без капчи**; регистрация по имени пользователя и мобильному отключена |
| Политика адресов | локальная часть только `[A-Za-z0-9_]+`, домен из белого списка, ограничение длины → **gmail — это семейство адресов, которое проходит** |
| Один аккаунт на контакт | `409 CONTACT_AT_LIMIT` — общие публичные gmail-ящики часто уже заняты |
| Регистраций на IP | **1 успешная регистрация на IP в день** — `403 当日注册次数已达上限` |
| Повторная отправка кода | кулдаун на адрес — `400 验证码发送过于频繁，请稍后再试` |
| Единица масштабирования | **один аккаунт = один ключ = один выход** (с пулом; прямой запуск создаёт один в день) |

> 💡 Бесплатный тариф устанавливается WhatsToken и может измениться. Проверяйте актуальные цифры на [www.whatstoken.ai](https://www.whatstoken.ai) — и пусть решение принимает собственный гейт инструмента:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 141

Публичный каталог содержит **141 запись моделей в 88 группах** по 5 категориям (chat / image / video / audio / video-enhance). Проверенная строка ключа — это flash-семейство DeepSeek:

| ID модели | Проверено |
| --- | --- |
| `deepseek-v4.1-flash-1017` | **10 ключей chat-200** в `providers/whatstoken/keys.txt`; полный прогон из второй сети (см. таблицу «Проверено») |
| `deepseek-v4.1-flash-1017-special` | chat-200 с теми же ключами (родственная модель со скидкой) |

Апстрим отвечает внутренним id `deepseek-v4-1-flash-261017`, поэтому роутер, сворачивающий алиасы, должен отображать оба обратно в базовое семейство `deepseek-v4.1-flash`.

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Как использовать API

Базовый URL **`https://www.whatstoken.ai/v1`** — совместим с OpenAI. Apex-домен `whatstoken.ai` только перенаправляет (`301`), а `api.whatstoken.ai` не разрешается, поэтому сохраняйте хост `www` в вашем клиенте.

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 Быстрый старт

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router
# or: node src/cli.js --count 30 --pool proxies.txt
```

Ключ записывается в `keys.txt` **только** после того, как `/v1/chat/completions` ответит 200 с реальным содержимым или содержимым рассуждений; `accounts.jsonl` хранит e-mail / пароль / uid / id токена / баланс подарка / выход / модель, а отклонённые попытки сохраняют свою причину.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси и количество, запоминает их в `launcher.config.json` и запускает CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `GET /api/v1/settings` | **200** — регистрация включена, регистрация по e-mail включена, по имени пользователя/мобильному отключена, без капчи, подарок за регистрацию включён |
| `POST /api/v1/auth/send-code` | **200** — панель отправляет письмо `【WhatsToken.AI】注册验证码` с `noreply@<panel-mail>` в течение ~5–10 с (срок жизни 5 минут) |
| `POST /api/v1/auth/register-email` | **200** — токен сессии в том же ответе; `403 当日注册次数已达上限`, как только у этого IP исчерпана дневная регистрация |
| `POST /api/v1/tokens` | **200** — ключ возвращается как `token_key` (не `key`), безлимитная квота |
| `POST /v1/chat/completions` (`deepseek-v4.1-flash-1017`) — для **каждого** ключа перед записью | **200** с реальным содержимым — создание 10 ключей завершилось 10/10 |
| независимая перепроверка — **10/10 ключей живых** из другого выхода (`--verify-only`, `deepseek-v4.1-flash-1017`, 2026-10-20) | все десять ключей PASS; родственная модель `-special` также отвечает 200 |
| заметки со стороны панели | регистрации ограничены **на IP в день**; неверный/просроченный код сначала сжигает адрес (`400 邮箱验证码无效`), а не выход |

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| гейты | `GET /api/v1/settings` | переключатели регистрации/маркетинга, без авторизации |
| почтовый ящик | Emailnator `POST /api/generate-email` | один свежий @gmail.com на аккаунт, регистрируется в форме без точек |
| отправка кода | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | при кулдауне отвечает `验证码发送过于频繁` |
| чтение кода | Emailnator `/api/message-list` → `/api/message/<id>` | сначала по бренду (`WhatsToken`/`reanimai`), затем приход в форме кода из снимка |
| регистрация | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → новый адрес, тот же выход; `403 当日注册次数已达上限` → следующий выход |
| ключ | `POST /api/v1/tokens` | безлимитная квота; поле ответа `token_key` |
| доказательство | `POST /v1/chat/completions` | 200 с содержимым/содержимым рассуждений = ключ живой |

## ⚙️ Опции CLI

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Переменная | По умолчанию | Значение |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | пул выходов, по одной строке на прокси |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | `timezone`, отправляемый в вызове регистрации |

CLI сохраняет `--conc` для полноты, но по умолчанию использует **1**: регистрация ограничена на IP в день, поэтому параллельные аккаунты лишь соревнуются за одну и ту же квоту.

## 🛰️ За прокси

**Необязательно — но провайдер делает это почти обязательным при любом масштабе.** Инструмент работает и без прокси.

- **С пулом:** передайте `--pool <file>` (или задайте `WHATSTOKEN_PROXIES`), и каждый запрос для аккаунта — send-code, register, wallet, key, chat-200 — идёт через один закреплённый выход из этого списка, так что код никогда не выдаётся одним адресом, а используется другим. Неудачный выход переводит попытку на следующий; выход, сообщающий `403 当日注册次数已达上限`, сжигается до конца запуска. С пулом запуск работает по принципу **fail-closed**: если ни один выход не достигает панели, запуск завершается неудачей вместо утечки запроса с вашего собственного адреса.
- **Без пула:** CLI выводит `running WITHOUT a proxy (direct)` и подключается напрямую — и тогда правило WhatsTokenAI «одна регистрация на IP в день» означает, что прямой запуск создаёт **один** ключ.
- Запустите `--screen` для любого режима: он тестирует имеющиеся у вас выходы (или прямой маршрут) против `GET /api/v1/settings` перед реальным запуском.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный в работе ключ на строку — игнорируется git |
| `accounts.jsonl` | e-mail / пароль / uid / id токена / баланс подарка / выход / модель / гейт — игнорируется git |
| `proxies.txt` | ваши выходы — игнорируется git |
| `out/` | логи запусков — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

По умолчанию: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Модели подаются как `whatstoken/<model id>`.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 Что даёт провайдер | $0.1 `gift_balance` при регистрации (регистрация по e-mail без капчи) |
| 🔑 Что даёт один ключ | один ключ на собственном аккаунте, проверенный в чате на `deepseek-v4.1-flash-1017` |
| 🌐 Форма API | Совместим с OpenAI: `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 Ваши данные | устанавливается связь только с `www.whatstoken.ai` и вашим бэкендом почтового ящика |

## 🐞 Проблемы

Если WhatsTokenAI изменит свои гейты регистрации, политику адресов или подарок за регистрацию, инструмент остановится на этом шаге и сообщит, на каком именно. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>