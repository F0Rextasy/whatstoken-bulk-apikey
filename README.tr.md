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

**Otomatik oluşturulan API anahtarlarıyla toplu WhatsTokenAI hesabı açın — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-141-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

WhatsTokenAI, Çin'e yönelik bir CDN arkasındaki new-api'nin TokensByte / tkeapi sürümüdür. Kayıt **captcha'sız ve yalnızca e-posta iledir** (`enable_username_registration: false`, `enable_email_registration: true`, konsol paketinde hiçbir yerde Turnstile/hCaptcha/Geetest yok), pazarlama modülü her yeni hesaba bir **kayıt hediyesi (ölçülen 0.1 USD `gift_balance`)** verir ve panel API'si, üzerine kapı koyabileceğiniz herkese açık bir `GET /api/v1/settings` yanıtlar. Tüm araç uçtan uca kanıtlandı: **10 hesap → 10 doğrulanmış anahtar** üretildi, ardından onun tamamı farklı bir ağdan yeniden kanıtlandı.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

| Ne | Değer |
| --- | --- |
| Kayıt hediyesi | **hesap başına 0.1 USD `gift_balance`** (`balance 0.0`; `marketing.enable_registration_gift: true`, `invite_reward_invitee: 0.1`) |
| Kayıt kapısı | e-posta + 6 haneli kod — **captcha yok**; kullanıcı adı ve mobil kayıt kapalı |
| Adres politikası | yerel kısım yalnızca `[A-Za-z0-9_]+`, beyaz listeye alınmış alan adı, uzunluk sınırı → **geçen adres ailesi gmail'dir** |
| Kişi başına bir hesap | `409 CONTACT_AT_LIMIT` — paylaşılan genel gmail kutuları çoğu zaman zaten alınmıştır |
| IP başına kayıt | **IP başına günde 1 başarılı kayıt** — `403 当日注册次数已达上限` |
| Kod yeniden gönderimi | adres başına bekleme süresi — `400 验证码发送过于频繁，请稍后再试` |
| Ölçeklenen birim | **bir hesap = bir anahtar = bir çıkış** (bir havuzla; doğrudan çalıştırma günde bir tane üretir) |

> 💡 Ücretsiz katman WhatsToken tarafından belirlenir ve değişebilir. Güncel sayıları [www.whatstoken.ai](https://www.whatstoken.ai) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 141'inin tamamı

Herkese açık katalog, 5 kategoride (chat / image / video / audio / video-enhance) **88 grupta 141 model girdisi** içerir. Doğrulanmış anahtar satırı DeepSeek'in flash ailesidir:

| Model Kimliği | Doğrulandı |
| --- | --- |
| `deepseek-v4.1-flash-1017` | `providers/whatstoken/keys.txt` içinde **10 anahtar chat-200**; ikinci bir ağdan tam tarama (Doğrulandı tablosuna bakın) |
| `deepseek-v4.1-flash-1017-special` | aynı anahtarlarla chat-200 (indirimli kardeş model) |

Upstream, dahili `deepseek-v4-1-flash-261017` kimliğiyle yanıt verir; dolayısıyla takma adları birleştiren bir yönlendirici her ikisini de temel `deepseek-v4.1-flash` ailesine eşlemelidir.

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API nasıl kullanılır

Temel URL **`https://www.whatstoken.ai/v1`** — OpenAI uyumlu. Apex `whatstoken.ai` yalnızca yönlendirir (`301`) ve `api.whatstoken.ai` çözümlenmez, bu yüzden istemcinizde `www` ana bilgisayarını koruyun.

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 Hızlı başlangıç

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router
# or: node src/cli.js --count 30 --pool proxies.txt
```

Bir anahtar `keys.txt` dosyasına **yalnızca** `/v1/chat/completions` gerçek içerik veya akıl yürütme içeriğiyle 200 yanıt verdikten sonra yazılır; `accounts.jsonl` e-posta / parola / uid / token kimliği / hediye bakiyesi / çıkış / model bilgilerini saklar ve reddedilen denemeler gerekçelerini korur.

### 🖱️ Başlatıcı

Başlatıcı, proxy listesini ve sayıyı sorar, bunları `launcher.config.json` içinde hatırlar ve CLI'yi çalıştırır — üret, doğrula, çıkışları tara, ayarlar, yardım, 9Router'a Bağlan.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET /api/v1/settings` | **200** — kayıt açık, e-posta kaydı açık, kullanıcı adı/mobil kapalı, captcha yok, kayıt hediyesi açık |
| `POST /api/v1/auth/send-code` | **200** — panel, `noreply@<panel-mail>` adresinden ~5–10 sn içinde `【WhatsToken.AI】注册验证码` gönderir (5 dakika ömür) |
| `POST /api/v1/auth/register-email` | **200** — oturum token'ı aynı yanıtta; o IP günlük kaydını yaptıktan sonra `403 当日注册次数已达上限` |
| `POST /api/v1/tokens` | **200** — anahtar `token_key` olarak döner (`key` değil), sınırsız kota |
| `POST /v1/chat/completions` (`deepseek-v4.1-flash-1017`) — yazılmadan önce **her** anahtar için | gerçek içerikle **200** — 10 anahtarlık üretim 10/10 ile tamamlandı |
| bağımsız yeniden kontrol — farklı bir çıkıştan **10/10 anahtar canlı** (`--verify-only`, `deepseek-v4.1-flash-1017`, 2026-10-20) | on anahtarın tamamı PASS; kardeş `-special` modeli de 200 yanıt verir |
| panel tarafı notlar | kayıtlar **IP başına günlük** sınırlıdır; hatalı/süresi geçmiş kod önce adresi yakar (`400 邮箱验证码无效`), çıkışı değil |

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| kapılar | `GET /api/v1/settings` | kayıt/pazarlama anahtarları, kimlik doğrulama yok |
| posta kutusu | Emailnator `POST /api/generate-email` | hesap başına bir taze @gmail.com, noktasız biçimde kaydedilir |
| kod gönder | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | bekleme süresi `验证码发送过于频繁` yanıtı verir |
| kodu oku | Emailnator `/api/message-list` → `/api/message/<id>` | önce marka (`WhatsToken`/`reanimai`), sonra anlık görüntüden kod biçimli bir geliş |
| kaydol | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → yeni adres, aynı çıkış; `403 当日注册次数已达上限` → sonraki çıkış |
| anahtar | `POST /api/v1/tokens` | sınırsız kota; yanıt alanı `token_key` |
| kanıt | `POST /v1/chat/completions` | içerik/akıl yürütme içeriğiyle 200 = anahtar canlı |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Ortam değişkeni | Varsayılan | Anlamı |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | çıkış havuzu, her satırda bir proxy |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | kayıt çağrısına gönderilen `timezone` |

CLI, eksiksizlik için `--conc` seçeneğini korur ancak varsayılan olarak **1** kullanır: kayıt IP başına günlük sınırlıdır, bu yüzden paralel hesaplar yalnızca aynı kota için yarışır.

## 🛰️ Proxy arkasında

**İsteğe bağlı — ancak sağlayıcı bunu her ölçekte neredeyse zorunlu kılar.** Araç proxy olmadan da çalışır.

- **Bir havuzla:** `--pool <file>` geçin (veya `WHATSTOKEN_PROXIES` ayarlayın) ve bir hesap için her istek — send-code, register, wallet, key, chat-200 — bu listeden sabitlenmiş tek bir çıkıştan geçer, böylece kod bir adres tarafından verilip başka bir adres tarafından kullanılmaz. Başarısız bir çıkış denemeyi bir sonrakine taşır; `403 当日注册次数已达上限` bildiren bir çıkış, çalıştırmanın geri kalanı için yakılır. Bir havuzla çalıştırma **fail-closed**'dur: hiçbir çıkış panele ulaşamazsa, kendi adresinizden bir istek sızdırmak yerine çalıştırma başarısız olur.
- **Havuz olmadan:** CLI `running WITHOUT a proxy (direct)` yazdırır ve doğrudan bağlanır — ve ardından WhatsTokenAI'nin IP başına günde bir kayıt kuralı, doğrudan bir çalıştırmanın **bir** anahtar üretmesi anlamına gelir.
- `--screen` komutunu her iki moda karşı çalıştırın: gerçek bir çalıştırmadan önce sahip olduğunuz çıkışları (veya doğrudan rotayı) `GET /api/v1/settings` karşısında test eder.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.jsonl` | e-posta / parola / uid / token kimliği / hediye bakiyesi / çıkış / model / kapı — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız — git tarafından yok sayılır |
| `out/` | çalıştırma günlükleri — git tarafından yok sayılır |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi sunucunuzda barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

Varsayılanlar: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Modeller `whatstoken/<model id>` olarak sunulur.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 Sağlayıcının verdikleri | kayıtta $0.1 `gift_balance` (captcha'sız e-posta kaydı) |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabında bir anahtar, `deepseek-v4.1-flash-1017` üzerinde chat ile doğrulanmış |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca `www.whatstoken.ai` ve gelen kutunuzun arka ucuyla iletişim kurulur |

## 🐞 Sorunlar

WhatsTokenAI kayıt kapılarını, adres politikasını veya kayıt hediyesini değiştirirse, araç o adımda durur ve hangisi olduğunu söyler. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>