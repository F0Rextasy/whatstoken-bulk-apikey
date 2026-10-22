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

**批量创建 WhatsTokenAI 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-141-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么有这个项目

WhatsTokenAI 是面向中国 CDN 的 TokensByte / tkeapi 版 new-api。注册**无需验证码，仅需邮箱**（`enable_username_registration: false`、`enable_email_registration: true`，控制台打包文件中没有任何 Turnstile/hCaptcha/Geetest），营销模块会给每个新账户发放**注册礼金（实测 0.1 美元 `gift_balance`）**，面板 API 会响应一个公开的 `GET /api/v1/settings`，你可以据此进行判断。整个工具已通过端到端验证：铸造 **10 个账户 → 10 个已验证密钥**，随后又从另一个网络重新验证了全部十个。

## 🎁 免费额度 — 你能获得多少

| 项目 | 值 |
| --- | --- |
| 注册礼金 | **每个账户 0.1 美元 `gift_balance`**（`balance 0.0`；`marketing.enable_registration_gift: true`，`invite_reward_invitee: 0.1`） |
| 注册门槛 | 邮箱 + 6 位验证码 — **无验证码**；用户名和手机号注册已关闭 |
| 地址策略 | 本地部分仅允许 `[A-Za-z0-9_]+`，域名需在白名单内，有长度上限 → **gmail 是能通过的地址族** |
| 每个联系方式一个账户 | `409 CONTACT_AT_LIMIT` — 共享的公共 gmail 邮箱往往已被占用 |
| 每个 IP 的注册次数 | **每个 IP 每天 1 次成功注册** — `403 当日注册次数已达上限` |
| 验证码重发 | 按地址冷却 — `400 验证码发送过于频繁，请稍后再试` |
| 可扩展的单位 | **一个账户 = 一个密钥 = 一个出口**（配合代理池；直连运行每天只能铸造一个） |

> 💡 免费额度由 WhatsToken 设定，可能发生变化。请在 [www.whatstoken.ai](https://www.whatstoken.ai) 查看实时数据 — 并让工具自身的门槛来判断：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 141 个

公开目录包含 **88 个分组中的 141 个模型条目**，涵盖 5 个类别（chat / image / video / audio / video-enhance）。已验证的密钥线路是 DeepSeek 的 flash 系列：

| 模型 ID | 已验证 |
| --- | --- |
| `deepseek-v4.1-flash-1017` | `providers/whatstoken/keys.txt` 中 **10 个密钥 chat-200**；从第二个网络进行了完整扫描（见已验证表） |
| `deepseek-v4.1-flash-1017-special` | 相同密钥 chat-200（折扣版姊妹模型） |

上游返回的内部 ID 为 `deepseek-v4-1-flash-261017`，因此折叠别名的路由器应将两者都映射回基础 `deepseek-v4.1-flash` 系列。

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 如何使用 API

基础 URL **`https://www.whatstoken.ai/v1`** — 兼容 OpenAI。顶级域名 `whatstoken.ai` 只会重定向（`301`），而 `api.whatstoken.ai` 无法解析，因此请在客户端中保留 `www` 主机名。

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 快速开始

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router

# or: node src/cli.js --count 30 --pool proxies.txt
```

只有当 `/v1/chat/completions` 返回 200 且带有真实内容或推理内容时，密钥才会被写入 `keys.txt`；`accounts.jsonl` 保留邮箱 / 密码 / uid / token id / 礼金余额 / 出口 / 模型，被拒绝的尝试则保留其原因。

### 🖱️ 启动器

启动器会询问代理列表和数量，将它们记住在 `launcher.config.json` 中，并运行 CLI — 铸造、验证、筛选出口、设置、帮助、连接到 9Router。

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查 | 结果 |
| --- | --- |
| `GET /api/v1/settings` | **200** — 注册开启，邮箱注册开启，用户名/手机号关闭，无验证码，注册礼金开启 |
| `POST /api/v1/auth/send-code` | **200** — 面板在约 5–10 秒内从 `noreply@<panel-mail>` 发送 `【WhatsToken.AI】注册验证码`（有效期 5 分钟） |
| `POST /api/v1/auth/register-email` | **200** — 同一响应中返回会话令牌；一旦该 IP 用完当日注册次数，则返回 `403 当日注册次数已达上限` |
| `POST /api/v1/tokens` | **200** — 密钥以 `token_key` 返回（不是 `key`），配额无限 |
| `POST /v1/chat/completions`（`deepseek-v4.1-flash-1017`）— 对**每个**密钥在写入前执行 | **200** 且带有真实内容 — 10 密钥铸造以 10/10 完成 |
| 独立复查 — 从不同出口验证 **10/10 密钥存活**（`--verify-only`，`deepseek-v4.1-flash-1017`，2026-10-20） | 全部十个密钥通过；姊妹模型 `-special` 也返回 200 |
| 面板侧说明 | 注册按**每个 IP 每天**设限；错误/过期的验证码会先消耗该地址（`400 邮箱验证码无效`），而非出口 |

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 门槛 | `GET /api/v1/settings` | 注册/营销开关，无需认证 |
| 邮箱 | Emailnator `POST /api/generate-email` | 每个账户一个全新的 @gmail.com，以无点形式注册 |
| 发送验证码 | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | 冷却时返回 `验证码发送过于频繁` |
| 读取验证码 | Emailnator `/api/message-list` → `/api/message/<id>` | 优先品牌（`WhatsToken`/`reanimai`），然后从快照中寻找验证码格式的来信 |
| 注册 | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → 换新地址，同一出口；`403 当日注册次数已达上限` → 换下一个出口 |
| 密钥 | `POST /api/v1/tokens` | 配额无限；响应字段 `token_key` |
| 验证 | `POST /v1/chat/completions` | 200 且带有内容/推理内容 = 密钥存活 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | 出口池，每行一个代理 |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | 发送给注册调用的 `timezone` |

CLI 出于完整性保留了 `--conc`，但默认为 **1**：注册按每个 IP 每天设限，因此并行账户只会争抢同一配额。

## 🛰️ 使用代理

**可选 — 但提供商使得在任何规模下几乎都必须使用。** 该工具在没有代理的情况下也能运行。

- **使用代理池时：** 传入 `--pool <file>`（或设置 `WHATSTOKEN_PROXIES`），账户的每个请求 — send-code、register、wallet、key、chat-200 — 都通过该列表中的一个固定出口，因此验证码绝不会由一个地址发出而由另一个地址兑换。失败的出口会将尝试转移到下一个；报告 `403 当日注册次数已达上限` 的出口将在本次运行的剩余时间内被弃用。使用代理池时运行是**故障关闭**的：如果没有出口能到达面板，运行将失败，而不会从你自己的地址泄露请求。
- **不使用代理池时：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接 — 然后 WhatsTokenAI 的每 IP 每天一次注册规则意味着直连运行只能铸造**一个**密钥。
- 对任一模式运行 `--screen`：它会在真实运行前，用 `GET /api/v1/settings` 测试你拥有的出口（或直连路由）。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经实时验证的密钥 — 已被 git 忽略 |
| `accounts.jsonl` | 邮箱 / 密码 / uid / token id / 礼金余额 / 出口 / 模型 / 门槛 — 已被 git 忽略 |
| `proxies.txt` | 你的出口 — 已被 git 忽略 |
| `out/` | 运行日志 — 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

默认值：`--prefix whatstoken`、`--base-url https://www.whatstoken.ai/v1`、`--model deepseek-v4.1-flash-1017`。模型以 `whatstoken/<model id>` 形式提供。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 提供商提供什么 | 注册时 $0.1 `gift_balance`（无需验证码的邮箱注册） |
| 🔑 一个密钥能给你什么 | 在其自己账户上的一个密钥，已在 `deepseek-v4.1-flash-1017` 上通过聊天验证 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 `www.whatstoken.ai` 和你的邮箱后端 |

## 🐞 问题反馈

如果 WhatsTokenAI 更改其注册门槛、地址策略或注册礼金，工具会在该步骤停止并说明是哪一步。请**[提交 issue](../../issues)**，附上命令和确切的输出。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>