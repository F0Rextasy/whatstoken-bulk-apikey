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

**WhatsTokenAI アカウントを自動生成された API キーとともに一括作成 — OpenAI 互換の推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-141-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

WhatsTokenAI は、中国向け CDN の背後にある new-api の TokensByte / tkeapi ビルドです。登録は**キャプチャ不要でメールのみ**(`enable_username_registration: false`、`enable_email_registration: true`、コンソールバンドル内のどこにも Turnstile/hCaptcha/Geetest なし)で、マーケティングモジュールはすべての新規アカウントに**サインアップ特典(実測 0.1 USD の `gift_balance`)**を付与し、パネル API は公開の `GET /api/v1/settings` に応答するのでこれをゲートにできます。このツール全体は、**10 アカウント → 10 個の検証済みキー**を発行することでエンドツーエンドで実証され、その後、別のネットワークから 10 個すべてを再実証しました。

## 🎁 無料枠 — いくら得られるか

| 項目 | 値 |
| --- | --- |
| サインアップ特典 | **アカウントごとに 0.1 USD の `gift_balance`**(`balance 0.0`、`marketing.enable_registration_gift: true`、`invite_reward_invitee: 0.1`) |
| サインアップのゲート | メール + 6 桁コード — **キャプチャなし**、ユーザー名とモバイル登録は無効 |
| アドレスポリシー | ローカル部は `[A-Za-z0-9_]+` のみ、ホワイトリスト済みドメイン、長さ上限 → **通るアドレスファミリーは gmail** |
| 連絡先ごとに 1 アカウント | `409 CONTACT_AT_LIMIT` — 共有の公開 gmail ボックスはすでに取得済みのことが多い |
| IP ごとの登録数 | **1 IP につき 1 日 1 回のサインアップ成功** — `403 当日注册次数已达上限` |
| コード再送 | アドレスごとのクールダウン — `400 验证码发送过于频繁，请稍后再试` |
| スケールする単位 | **1 アカウント = 1 キー = 1 出口**(プール使用時。直接実行では 1 日 1 個) |

> 💡 無料枠は WhatsToken が設定するもので、変更される可能性があります。最新の数値は [www.whatstoken.ai](https://www.whatstoken.ai) で確認してください — そしてツール自身のゲートに判断を任せましょう:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 141 個すべて

公開カタログには 5 カテゴリ(chat / image / video / audio / video-enhance)にわたる **88 グループ、141 個のモデルエントリ**が含まれています。検証済みキーのラインは DeepSeek の flash ファミリーです:

| モデル ID | 検証済み |
| --- | --- |
| `deepseek-v4.1-flash-1017` | `providers/whatstoken/keys.txt` 内の**すべてのキーで chat-200**、2 つ目のネットワークからの全数スイープ(検証済みテーブル参照) |
| `deepseek-v4.1-flash-1017-special` | 同じキーで chat-200(割引版の兄弟モデル) |

上流は内部 ID `deepseek-v4-1-flash-261017` で応答するため、エイリアスを畳み込むルーターは両方をベースの `deepseek-v4.1-flash` ファミリーにマッピングすべきです。

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API の使い方

ベース URL は **`https://www.whatstoken.ai/v1`** — OpenAI 互換です。apex の `whatstoken.ai` はリダイレクト(`301`)するだけで、`api.whatstoken.ai` は解決しないため、クライアントでは `www` ホストを維持してください。

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 クイックスタート

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router

# or: node src/cli.js --count 30 --pool proxies.txt
```

キーは `/v1/chat/completions` が実際のコンテンツまたは reasoning コンテンツとともに 200 を返した**後にのみ** `keys.txt` に書き込まれます。`accounts.jsonl` にはメール / パスワード / uid / トークン ID / 特典残高 / 出口 / モデルが保持され、拒否された試行はその理由を保持します。

### 🖱️ ランチャー

ランチャーはプロキシリストと件数を尋ね、それらを `launcher.config.json` に記憶し、CLI を実行します — mint、verify、screen exits、settings、help、Connect to 9Router。

## ✅ 動作検証済み — すべてのキーがテストされています

| チェック | 結果 |
| --- | --- |
| `GET /api/v1/settings` | **200** — 登録オン、メール登録オン、ユーザー名/モバイルオフ、キャプチャなし、サインアップ特典オン |
| `POST /api/v1/auth/send-code` | **200** — パネルが `noreply@<panel-mail>` から `【WhatsToken.AI】注册验证码` を約 5〜10 秒以内に送信(有効期間 5 分) |
| `POST /api/v1/auth/register-email` | **200** — 同じレスポンスにセッショントークン。その IP がその日のサインアップを済ませると `403 当日注册次数已达上限` |
| `POST /api/v1/tokens` | **200** — キーは `key` ではなく `token_key` として返る、クォータ無制限 |
| `POST /v1/chat/completions`(`deepseek-v4.1-flash-1017`)— 書き込まれる前の**すべての**キーに対して | 実際のコンテンツとともに **200** — 10 キーの mint は 10/10 で完了 |
| 独立した再チェック — 別の出口から**すべてのキーを検証**(`--verify-only`、`deepseek-v4.1-flash-1017`、2026-10-20) | 10 個すべてのキーが PASS、兄弟の `-special` モデルも 200 を返す |
| パネル側の注意 | 登録は **IP ごと 1 日あたり**で上限あり。不正/期限切れのコードはまずアドレスを消費する(`400 邮箱验证码无效`)、出口ではない |

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブの `chat-200` を通過しています
> (死んだキーは決して出荷されません)。ルーターのコンボもモデルレベルで同じルールに従います: エントリは
> **モデルが `chat-200` を返し、ツールを呼び出せる場合にのみ**追加されます — ツールサポートのないモデル、
> 死んだキー、死んだプロバイダーは追加されずに除外されます。検証ステップはいつでも再実行できます。
> 失敗は報告され、決して隠されません。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| ゲート | `GET /api/v1/settings` | 登録/マーケティングのスイッチ、認証なし |
| メールボックス | Emailnator `POST /api/generate-email` | アカウントごとに 1 つの新しい @gmail.com、ドットなし形式で登録 |
| コード送信 | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | クールダウン時は `验证码发送过于频繁` を返す |
| コード読み取り | Emailnator `/api/message-list` → `/api/message/<id>` | ブランド優先(`WhatsToken`/`reanimai`)、次にスナップショットからコード形式の到着 |
| 登録 | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → 新しいアドレス、同じ出口。`403 当日注册次数已达上限` → 次の出口 |
| キー | `POST /api/v1/tokens` | クォータ無制限、応答フィールドは `token_key` |
| 証明 | `POST /v1/chat/completions` | コンテンツ/reasoning コンテンツとともに 200 = キーはライブ |

## ⚙️ CLI オプション

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | 出口プール、1 行につき 1 プロキシ |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | register 呼び出しに送られる `timezone` |

CLI は完全性のために `--conc` を保持していますが、デフォルトは **1** です: 登録は IP ごと 1 日あたりで上限があるため、並列アカウントは同じクォータを奪い合うだけです。

## 🛰️ プロキシの背後で

**任意 — ただしプロバイダーはどの規模でもほぼ必須にします。** ツールはプロキシなしでも動作します。

- **プールあり:** `--pool <file>` を渡す(または `WHATSTOKEN_PROXIES` を設定する)と、アカウントのすべてのリクエスト — send-code、register、wallet、key、chat-200 — がそのリストから固定された 1 つの出口を経由するため、コードが 1 つのアドレスから発行されて別のアドレスで引き換えられることはありません。失敗した出口は試行を次へ移します。`403 当日注册次数已达上限` を報告する出口は、その実行の残りの間は消費済みとなります。プールありの場合、実行は **fail-closed** です: どの出口もパネルに到達できなければ、自分のアドレスからリクエストが漏れるのではなく、実行は失敗します。
- **プールなし:** CLI は `running WITHOUT a proxy (direct)` と表示して直接接続します — そして WhatsTokenAI の 1 IP 1 日 1 サインアップのルールにより、直接実行では**1 つ**のキーしか mint できません。
- どちらのモードでも `--screen` を実行してください: 実際の実行前に、手持ちの出口(または直接ルート)を `GET /api/v1/settings` に対してテストします。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行につき 1 つのライブ検証済みキー — git 無視 |
| `accounts.jsonl` | メール / パスワード / uid / トークン ID / 特典残高 / 出口 / モデル / ゲート — git 無視 |
| `proxies.txt` | あなたの出口 — git 無視 |
| `out/` | 実行ログ — git 無視 |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホストの OpenAI 互換ルーターです:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

デフォルト: `--prefix whatstoken`、`--base-url https://www.whatstoken.ai/v1`、`--model deepseek-v4.1-flash-1017`。モデルは `whatstoken/<model id>` として提供されます。

## 🔌 OmniRoute に接続

[OmniRoute](https://omniroute.online) はセルフホストの OpenAI 互換ルーターです:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-omniroute      # same, from the CLI
```

デフォルト: `--prefix whatstoken`、`--base-url https://www.whatstoken.ai/v1`、`--model deepseek-v4.1-flash-1017`。モデルは `whatstoken/<model id>` として提供されます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 プロバイダーが提供するもの | サインアップ時に $0.1 の `gift_balance`(キャプチャ不要のメールサインアップ) |
| 🔑 1 つのキーで得られるもの | 独自のアカウント上の 1 つのキー、`deepseek-v4.1-flash-1017` で chat 検証済み |
| 🌐 API 形式 | OpenAI 互換: `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 あなたのデータ | 接続されるのは `www.whatstoken.ai` とあなたの受信トレイバックエンドのみ |

## 🐞 問題報告

WhatsTokenAI が登録ゲート、アドレスポリシー、またはサインアップ特典を変更した場合、ツールはそのステップで停止し、どれであるかを示します。コマンドと正確な出力を添えて **[issue を作成してください](../../issues)**。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>