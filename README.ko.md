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

**자동 생성된 API 키로 WhatsTokenAI 계정을 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-141-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

WhatsTokenAI는 중국을 대상으로 하는 CDN 뒤에 있는 new-api의 TokensByte / tkeapi 빌드입니다. 가입은 **캡차 없이 이메일만으로** 가능하며(`enable_username_registration: false`, `enable_email_registration: true`, 콘솔 번들 어디에도 Turnstile/hCaptcha/Geetest 없음), 마케팅 모듈은 모든 신규 계정에 **가입 선물(측정된 0.1 USD `gift_balance`)** 을 지급하고, 패널 API는 게이트로 삼을 수 있는 공개 `GET /api/v1/settings`에 응답합니다. 이 도구 전체는 **10개 계정 → 10개의 검증된 키**를 발급하여 엔드투엔드로 입증되었고, 이후 다른 네트워크에서 열 개 모두를 다시 입증했습니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 가입 선물 | **계정당 0.1 USD `gift_balance`** (`balance 0.0`; `marketing.enable_registration_gift: true`, `invite_reward_invitee: 0.1`) |
| 가입 게이트 | 이메일 + 6자리 코드 — **캡차 없음**; 사용자 이름 및 휴대폰 가입은 비활성화됨 |
| 주소 정책 | 로컬 파트는 `[A-Za-z0-9_]+`만, 화이트리스트 도메인, 길이 제한 → **gmail이 통과하는 주소 계열** |
| 연락처당 하나의 계정 | `409 CONTACT_AT_LIMIT` — 공용 gmail 사서함은 이미 사용 중인 경우가 많음 |
| IP당 가입 횟수 | **IP당 하루 1회 성공적인 가입** — `403 当日注册次数已达上限` |
| 코드 재전송 | 주소별 쿨다운 — `400 验证码发送过于频繁，请稍后再试` |
| 확장되는 단위 | **계정 하나 = 키 하나 = 출구 하나** (풀 사용 시; 직접 실행은 하루에 하나 발급) |

> 💡 무료 티어는 WhatsToken이 설정하며 변경될 수 있습니다. 실시간 수치는 [www.whatstoken.ai](https://www.whatstoken.ai)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 141개 전부

공개 카탈로그에는 5개 카테고리(chat / image / video / audio / video-enhance)에 걸쳐 **88개 그룹의 141개 모델 항목**이 있습니다. 검증된 키 라인은 DeepSeek의 flash 계열입니다:

| 모델 ID | 검증됨 |
| --- | --- |
| `deepseek-v4.1-flash-1017` | `providers/whatstoken/keys.txt`의 **10개 키 chat-200**; 두 번째 네트워크에서 전체 스윕(검증됨 표 참조) |
| `deepseek-v4.1-flash-1017-special` | 동일한 키로 chat-200 (할인된 형제 모델) |

업스트림은 내부 id `deepseek-v4-1-flash-261017`로 응답하므로, 별칭을 병합하는 라우터는 둘 다 기본 `deepseek-v4.1-flash` 계열로 매핑해야 합니다.

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API 사용 방법

Base URL **`https://www.whatstoken.ai/v1`** — OpenAI 호환. apex `whatstoken.ai`는 리다이렉트(`301`)만 하고 `api.whatstoken.ai`는 확인되지 않으므로, 클라이언트에서 `www` 호스트를 유지하세요.

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 빠른 시작

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router
# or: node src/cli.js --count 30 --pool proxies.txt
```

키는 `/v1/chat/completions`가 실제 콘텐츠 또는 추론 콘텐츠와 함께 200으로 응답한 **후에만** `keys.txt`에 기록됩니다; `accounts.jsonl`은 이메일 / 비밀번호 / uid / 토큰 id / 선물 잔액 / 출구 / 모델을 보관하고, 거부된 시도는 그 이유를 보관합니다.

### 🖱️ 런처

런처는 프록시 목록과 개수를 묻고, 이를 `launcher.config.json`에 기억한 뒤 CLI를 실행합니다 — 발급, 검증, 출구 스크리닝, 설정, 도움말, 9Router 연결.

## ✅ 검증됨 — 모든 키가 테스트됨

| 확인 | 결과 |
| --- | --- |
| `GET /api/v1/settings` | **200** — 가입 켜짐, 이메일 가입 켜짐, 사용자 이름/휴대폰 꺼짐, 캡차 없음, 가입 선물 켜짐 |
| `POST /api/v1/auth/send-code` | **200** — 패널이 `noreply@<panel-mail>`에서 `【WhatsToken.AI】注册验证码`를 약 5–10초 내에 발송(5분 유효) |
| `POST /api/v1/auth/register-email` | **200** — 같은 응답에 세션 토큰; 해당 IP가 일일 가입을 마치면 `403 当日注册次数已达上限` |
| `POST /api/v1/tokens` | **200** — 키는 `key`가 아닌 `token_key`로 반환됨, 무제한 할당량 |
| `POST /v1/chat/completions` (`deepseek-v4.1-flash-1017`) — 기록되기 전 **모든** 키에 대해 | 실제 콘텐츠와 함께 **200** — 10개 키 발급이 10/10으로 완료됨 |
| 독립적 재확인 — 다른 출구에서 **10/10 키 라이브** (`--verify-only`, `deepseek-v4.1-flash-1017`, 2026-10-20) | 열 개 키 모두 PASS; 형제 `-special` 모델도 200으로 응답 |
| 패널 측 참고 | 가입은 **IP당 하루**로 제한됨; 잘못되었거나 만료된 코드는 출구가 아니라 주소를 먼저 소모함(`400 邮箱验证码无效`) |

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 참고 |
| --- | --- | --- |
| 게이트 | `GET /api/v1/settings` | 가입/마케팅 스위치, 인증 없음 |
| 사서함 | Emailnator `POST /api/generate-email` | 계정당 하나의 새 @gmail.com, 점 없는 형식으로 등록됨 |
| 코드 전송 | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | 쿨다운 시 `验证码发送过于频繁` 응답 |
| 코드 읽기 | Emailnator `/api/message-list` → `/api/message/<id>` | 브랜드 우선(`WhatsToken`/`reanimai`), 그다음 스냅샷에서 코드 형태의 도착 메시지 |
| 가입 | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → 새 주소, 같은 출구; `403 当日注册次数已达上限` → 다음 출구 |
| 키 | `POST /api/v1/tokens` | 무제한 할당량; 응답 필드 `token_key` |
| 증명 | `POST /v1/chat/completions` | 콘텐츠/추론 콘텐츠와 함께 200 = 키가 라이브 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | 출구 풀, 프록시당 한 줄 |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | register 호출에 전송되는 `timezone` |

CLI는 완전성을 위해 `--conc`를 유지하지만 기본값은 **1**입니다: 가입은 IP당 하루로 제한되므로, 병렬 계정은 같은 할당량을 두고 경쟁할 뿐입니다.

## 🛰️ 프록시 뒤에서

**선택 사항 — 하지만 제공자가 어느 정도 규모에서는 거의 필수로 만듭니다.** 이 도구는 프록시 없이도 작동합니다.

- **풀 사용 시:** `--pool <file>`을 전달하거나(또는 `WHATSTOKEN_PROXIES` 설정) 계정에 대한 모든 요청 — send-code, register, wallet, key, chat-200 — 이 해당 목록의 고정된 하나의 출구를 통해 가므로, 코드가 한 주소에서 발급되고 다른 주소에서 사용되는 일이 없습니다. 실패한 출구는 시도를 다음 출구로 넘깁니다; `403 当日注册次数已达上限`을 보고하는 출구는 실행이 끝날 때까지 소모됩니다. 풀 사용 시 실행은 **fail-closed**입니다: 어떤 출구도 패널에 도달하지 못하면 자체 주소에서 요청을 유출하는 대신 실행이 실패합니다.
- **풀 없이:** CLI는 `running WITHOUT a proxy (direct)`를 출력하고 직접 연결합니다 — 그러면 WhatsTokenAI의 IP당 하루 1회 가입 규칙 때문에 직접 실행은 **하나**의 키를 발급합니다.
- 두 모드 모두에 대해 `--screen`을 실행하세요: 실제 실행 전에 보유한 출구(또는 직접 경로)를 `GET /api/v1/settings`에 대해 테스트합니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 라이브 검증된 키 한 줄에 하나 — git-ignored |
| `accounts.jsonl` | 이메일 / 비밀번호 / uid / 토큰 id / 선물 잔액 / 출구 / 모델 / 게이트 — git-ignored |
| `proxies.txt` | 사용자의 출구 — git-ignored |
| `out/` | 실행 로그 — git-ignored |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

기본값: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. 모델은 `whatstoken/<model id>`로 제공됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 제공자가 주는 것 | 가입 시 $0.1 `gift_balance` (캡차 없는 이메일 가입) |
| 🔑 키 하나로 얻는 것 | 자체 계정의 키 하나, `deepseek-v4.1-flash-1017`에서 chat 검증됨 |
| 🌐 API 형태 | OpenAI 호환: `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 사용자 데이터 | `www.whatstoken.ai`와 사용자의 사서함 백엔드만 접촉됨 |

## 🐞 이슈

WhatsTokenAI가 가입 게이트, 주소 정책 또는 가입 선물을 변경하면, 도구는 해당 단계에서 멈추고 어느 것인지 알려줍니다. 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>