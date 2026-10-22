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

**Crie contas WhatsTokenAI em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-141-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

WhatsTokenAI é uma build TokensByte / tkeapi do new-api por trás de uma CDN voltada para a China. O registro é **sem captcha e apenas por e-mail** (`enable_username_registration: false`, `enable_email_registration: true`, sem Turnstile/hCaptcha/Geetest em nenhum lugar do bundle do console), o módulo de marketing concede a cada nova conta um **presente de cadastro (medido em 0,1 USD de `gift_balance`)**, e a API do painel responde a um `GET /api/v1/settings` público no qual você pode se basear. A ferramenta inteira foi comprovada de ponta a ponta criando **10 contas → 10 chaves verificadas**, e depois comprovando novamente todas as dez a partir de uma rede diferente.

## 🎁 Nível gratuito — quanto você recebe

| O quê | Valor |
| --- | --- |
| Presente de cadastro | **0,1 USD de `gift_balance` por conta** (`balance 0.0`; `marketing.enable_registration_gift: true`, `invite_reward_invitee: 0.1`) |
| Barreira de cadastro | e-mail + código de 6 dígitos — **sem captcha**; registro por nome de usuário e celular estão desativados |
| Política de endereço | parte local apenas `[A-Za-z0-9_]+`, domínio na lista de permissões, limite de comprimento → **gmail é a família de endereços que passa** |
| Uma conta por contato | `409 CONTACT_AT_LIMIT` — as caixas públicas compartilhadas do gmail muitas vezes já estão ocupadas |
| Registros por IP | **1 cadastro bem-sucedido por IP por dia** — `403 当日注册次数已达上限` |
| Reenvio de código | cooldown por endereço — `400 验证码发送过于频繁，请稍后再试` |
| A unidade que escala | **uma conta = uma chave = uma saída** (com um pool; uma execução direta cria uma por dia) |

> 💡 O nível gratuito é definido pela WhatsToken e pode mudar. Confira os números ao vivo em [www.whatstoken.ai](https://www.whatstoken.ai) — e deixe a própria barreira da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 141

O catálogo público traz **141 entradas de modelo em 88 grupos** distribuídas em 5 categorias (chat / imagem / vídeo / áudio / aprimoramento de vídeo). A linha de chave verificada é a família flash da DeepSeek:

| ID do modelo | Verificado |
| --- | --- |
| `deepseek-v4.1-flash-1017` | **10 chaves chat-200** em `providers/whatstoken/keys.txt`; varredura completa a partir de uma segunda rede (veja a tabela Verificado) |
| `deepseek-v4.1-flash-1017-special` | chat-200 com as mesmas chaves (o irmão com desconto) |

O upstream responde com o id interno `deepseek-v4-1-flash-261017`, então um roteador que agrupa aliases deve mapear ambos de volta para a família base `deepseek-v4.1-flash`.

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Como usar a API

URL base **`https://www.whatstoken.ai/v1`** — compatível com OpenAI. O apex `whatstoken.ai` apenas redireciona (`301`) e `api.whatstoken.ai` não resolve, então mantenha o host `www` no seu cliente.

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 Início rápido

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router

# or: node src/cli.js --count 30 --pool proxies.txt
```

Uma chave é gravada em `keys.txt` **somente** depois que `/v1/chat/completions` responde 200 com conteúdo real ou conteúdo de raciocínio; `accounts.jsonl` guarda e-mail / senha / uid / id do token / saldo de presente / saída / modelo, e as tentativas rejeitadas mantêm seu motivo.

### 🖱️ O launcher

O launcher pede a lista de proxies e a quantidade, memoriza-os em `launcher.config.json` e executa a CLI — criar, verificar, testar saídas, configurações, ajuda, Conectar ao 9Router.

## ✅ Verificado e funcionando — toda chave é testada

| Verificação | Resultado |
| --- | --- |
| `GET /api/v1/settings` | **200** — registro ativado, registro por e-mail ativado, nome de usuário/celular desativados, sem captcha, presente de cadastro ativado |
| `POST /api/v1/auth/send-code` | **200** — o painel envia por e-mail `【WhatsToken.AI】注册验证码` de `noreply@<panel-mail>` em ~5–10 s (validade de 5 minutos) |
| `POST /api/v1/auth/register-email` | **200** — token de sessão na mesma resposta; `403 当日注册次数已达上限` assim que aquele IP já teve seu cadastro diário |
| `POST /api/v1/tokens` | **200** — a chave volta como `token_key` (não `key`), cota ilimitada |
| `POST /v1/chat/completions` (`deepseek-v4.1-flash-1017`) — para **toda** chave antes de ser gravada | **200** com conteúdo real — a criação das 10 chaves foi concluída em 10/10 |
| reverificação independente — **10/10 chaves ativas** a partir de uma saída diferente (`--verify-only`, `deepseek-v4.1-flash-1017`, 2026-10-20) | todas as dez chaves PASS; o modelo irmão `-special` também responde 200 |
| notas do lado do painel | os registros são limitados **por IP por dia**; um código inválido/expirado primeiro queima o endereço (`400 邮箱验证码无效`), não a saída |

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Notas |
| --- | --- | --- |
| barreiras | `GET /api/v1/settings` | chaves de registro/marketing, sem autenticação |
| caixa de correio | Emailnator `POST /api/generate-email` | um @gmail.com novo por conta, registrado na forma sem pontos |
| enviar código | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | cooldown responde `验证码发送过于频繁` |
| ler código | Emailnator `/api/message-list` → `/api/message/<id>` | marca primeiro (`WhatsToken`/`reanimai`), depois uma chegada com formato de código a partir do snapshot |
| registrar | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → novo endereço, mesma saída; `403 当日注册次数已达上限` → próxima saída |
| chave | `POST /api/v1/tokens` | cota ilimitada; campo de resposta `token_key` |
| prova | `POST /v1/chat/completions` | 200 com conteúdo/conteúdo de raciocínio = a chave está ativa |

## ⚙️ Opções da CLI

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Padrão | Significado |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | pool de saídas, uma linha por proxy |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | `timezone` enviado à chamada de registro |

A CLI mantém `--conc` por completude, mas o padrão é **1**: o registro é limitado por IP por dia, então contas paralelas apenas disputam a mesma cota.

## 🛰️ Atrás de um proxy

**Opcional — mas o provedor o torna quase obrigatório em qualquer escala.** A ferramenta também funciona sem proxy.

- **Com um pool:** passe `--pool <file>` (ou defina `WHATSTOKEN_PROXIES`) e toda requisição de uma conta — send-code, register, wallet, key, chat-200 — passa por uma saída fixada dessa lista, de modo que o código nunca é emitido por um endereço e resgatado por outro. Uma saída com falha move a tentativa para a próxima; uma saída que reporta `403 当日注册次数已达上限` é queimada pelo resto da execução. Com um pool, a execução é **fail-closed**: se nenhuma saída alcança o painel, a execução falha em vez de vazar uma requisição do seu próprio endereço.
- **Sem um pool:** a CLI imprime `running WITHOUT a proxy (direct)` e conecta diretamente — e então a regra de um cadastro por IP por dia da WhatsTokenAI significa que uma execução direta cria **uma** chave.
- Execute `--screen` em qualquer um dos modos: ele testa as saídas que você tem (ou a rota direta) contra `GET /api/v1/settings` antes de uma execução real.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorado pelo git |
| `accounts.jsonl` | e-mail / senha / uid / id do token / saldo de presente / saída / modelo / barreira — ignorado pelo git |
| `proxies.txt` | suas saídas — ignorado pelo git |
| `out/` | logs de execução — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

Padrões: `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Os modelos são servidos como `whatstoken/<model id>`.

## 🔑 O que uma chave lhe dá

| | |
| --- | --- |
| 🏢 Provedor | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 O que o provedor dá | $0,1 de `gift_balance` no cadastro (cadastro por e-mail sem captcha) |
| 🔑 O que uma chave lhe dá | uma chave em sua própria conta, verificada por chat em `deepseek-v4.1-flash-1017` |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 Seus dados | apenas `www.whatstoken.ai` e seu backend de caixa de entrada são contatados |

## 🐞 Problemas

Se a WhatsTokenAI mudar suas barreiras de registro, sua política de endereços ou o presente de cadastro, a ferramenta para nessa etapa e diz qual delas. **[Abra uma issue](../../issues)** com o comando e a saída exata.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>