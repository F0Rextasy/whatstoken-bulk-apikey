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

**Créez en masse des comptes WhatsTokenAI avec des clés API générées automatiquement — inférence compatible OpenAI + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-141%20served-412991?style=for-the-badge)](https://www.whatstoken.ai)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-141-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cet outil existe

WhatsTokenAI est une version TokensByte / tkeapi de new-api derrière un CDN orienté Chine. L'inscription est **sans captcha et uniquement par e-mail** (`enable_username_registration: false`, `enable_email_registration: true`, aucun Turnstile/hCaptcha/Geetest nulle part dans le bundle de la console), le module marketing offre à chaque nouveau compte un **cadeau d'inscription (mesuré à 0,1 USD de `gift_balance`)**, et l'API du panneau répond à un `GET /api/v1/settings` public sur lequel vous pouvez vous baser. L'outil entier a été prouvé de bout en bout en créant **10 comptes → 10 clés vérifiées**, puis en revérifiant les dix depuis un autre réseau.

## 🎁 Offre gratuite — ce que vous obtenez

| Élément | Valeur |
| --- | --- |
| Cadeau d'inscription | **0,1 USD de `gift_balance` par compte** (`balance 0.0` ; `marketing.enable_registration_gift: true`, `invite_reward_invitee: 0.1`) |
| Condition d'inscription | e-mail + code à 6 chiffres — **aucun captcha** ; l'inscription par nom d'utilisateur et par mobile est désactivée |
| Politique d'adresse | partie locale `[A-Za-z0-9_]+` uniquement, domaine en liste blanche, longueur limitée → **gmail est la famille d'adresses qui passe** |
| Un compte par contact | `409 CONTACT_AT_LIMIT` — les boîtes gmail publiques partagées sont souvent déjà prises |
| Inscriptions par IP | **1 inscription réussie par IP et par jour** — `403 当日注册次数已达上限` |
| Renvoi de code | délai par adresse — `400 验证码发送过于频繁，请稍后再试` |
| L'unité qui passe à l'échelle | **un compte = une clé = une sortie** (avec un pool ; une exécution directe en crée une par jour) |

> 💡 L'offre gratuite est définie par WhatsToken et peut changer. Consultez les chiffres en direct sur [www.whatstoken.ai](https://www.whatstoken.ai) — et laissez la propre barrière de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 141 au complet

Le catalogue public contient **141 entrées de modèles réparties en 88 groupes** sur 5 catégories (chat / image / vidéo / audio / amélioration vidéo). La ligne de clé vérifiée est la famille flash de DeepSeek :

| ID du modèle | Vérifié |
| --- | --- |
| `deepseek-v4.1-flash-1017` | **10 clés chat-200** dans `providers/whatstoken/keys.txt` ; balayage complet depuis un second réseau (voir le tableau Vérifié) |
| `deepseek-v4.1-flash-1017-special` | chat-200 avec les mêmes clés (le frère à tarif réduit) |

L'amont répond avec l'id interne `deepseek-v4-1-flash-261017`, donc un routeur qui fusionne les alias devrait ramener les deux vers la famille de base `deepseek-v4.1-flash`.

```bash
curl https://www.whatstoken.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-adcc…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash-1017","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Comment utiliser l'API

URL de base **`https://www.whatstoken.ai/v1`** — compatible OpenAI. L'apex `whatstoken.ai` ne fait que rediriger (`301`) et `api.whatstoken.ai` ne résout pas, donc gardez l'hôte `www` dans votre client.

```python
from openai import OpenAI
c = OpenAI(base_url="https://www.whatstoken.ai/v1", api_key="sk-adcc…")
print(c.chat.completions.create(model="deepseek-v4.1-flash-1017",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 Démarrage rapide

```bash
cd whatstoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings / 9Router

# or: node src/cli.js --count 30 --pool proxies.txt
```

Une clé n'est écrite dans `keys.txt` **qu'après** que `/v1/chat/completions` ait répondu 200 avec du contenu réel ou du contenu de raisonnement ; `accounts.jsonl` conserve e-mail / mot de passe / uid / id de jeton / solde cadeau / sortie / modèle, et les tentatives rejetées conservent leur raison.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxys et le nombre, les mémorise dans `launcher.config.json`, et exécute le CLI — créer, vérifier, tester les sorties, paramètres, aide, Connect to 9Router.

## ✅ Vérifié et fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `GET /api/v1/settings` | **200** — inscription activée, inscription par e-mail activée, nom d'utilisateur/mobile désactivés, aucun captcha, cadeau d'inscription activé |
| `POST /api/v1/auth/send-code` | **200** — le panneau envoie `【WhatsToken.AI】注册验证码` depuis `noreply@<panel-mail>` en ~5–10 s (durée de vie 5 minutes) |
| `POST /api/v1/auth/register-email` | **200** — jeton de session dans la même réponse ; `403 当日注册次数已达上限` une fois que cette IP a eu son inscription quotidienne |
| `POST /api/v1/tokens` | **200** — la clé revient sous `token_key` (et non `key`), quota illimité |
| `POST /v1/chat/completions` (`deepseek-v4.1-flash-1017`) — pour **chaque** clé avant son écriture | **200** avec du contenu réel — la création des 10 clés s'est terminée à 10/10 |
| revérification indépendante — **10/10 clés actives** depuis une autre sortie (`--verify-only`, `deepseek-v4.1-flash-1017`, 2026-10-20) | les dix clés PASSENT ; le modèle frère `-special` répond aussi 200 |
| notes côté panneau | les inscriptions sont plafonnées **par IP et par jour** ; un code erroné/expiré brûle d'abord l'adresse (`400 邮箱验证码无效`), pas la sortie |

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: WhatsToken page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://www.whatstoken.ai/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| barrières | `GET /api/v1/settings` | interrupteurs d'inscription/marketing, sans auth |
| boîte mail | Emailnator `POST /api/generate-email` | un nouveau @gmail.com par compte, enregistré sous la forme sans point |
| envoi du code | `POST /api/v1/auth/send-code` `{email, purpose:'register'}` | le délai répond `验证码发送过于频繁` |
| lecture du code | Emailnator `/api/message-list` → `/api/message/<id>` | d'abord la marque (`WhatsToken`/`reanimai`), puis une arrivée en forme de code depuis l'instantané |
| inscription | `POST /api/v1/auth/register-email` `{email, code, password, timezone}` | `409 CONTACT_AT_LIMIT` → nouvelle adresse, même sortie ; `403 当日注册次数已达上限` → sortie suivante |
| clé | `POST /api/v1/tokens` | quota illimité ; champ de réponse `token_key` |
| preuve | `POST /v1/chat/completions` | 200 avec contenu/contenu de raisonnement = la clé est active |

## ⚙️ Options du CLI

```bash
node src/cli.js --count N        # mint N keys (chat gate per account)
node src/cli.js --model deepseek-v4.1-flash-1017-special
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Défaut | Signification |
| --- | --- | --- |
| `WHATSTOKEN_PROXIES` | `proxies.txt` | pool de sorties, une ligne par proxy |
| `WHATSTOKEN_TIMEZONE` | `Asia/Singapore` | `timezone` envoyé à l'appel d'inscription |

Le CLI conserve `--conc` par souci d'exhaustivité mais vaut **1** par défaut : l'inscription est plafonnée par IP et par jour, donc des comptes en parallèle ne font que se disputer le même quota.

## 🛰️ Derrière un proxy

**Facultatif — mais le fournisseur le rend presque obligatoire à toute échelle.** L'outil fonctionne aussi sans proxy.

- **Avec un pool :** passez `--pool <file>` (ou définissez `WHATSTOKEN_PROXIES`) et chaque requête pour un compte — envoi de code, inscription, portefeuille, clé, chat-200 — passe par une sortie épinglée de cette liste, de sorte que le code n'est jamais émis par une adresse et utilisé par une autre. Une sortie défaillante déplace la tentative vers la suivante ; une sortie qui renvoie `403 当日注册次数已达上限` est brûlée pour le reste de l'exécution. Avec un pool, l'exécution est **fail-closed** : si aucune sortie n'atteint le panneau, l'exécution échoue au lieu de laisser fuir une requête depuis votre propre adresse.
- **Sans pool :** le CLI affiche `running WITHOUT a proxy (direct)` et se connecte directement — et la règle d'une inscription par IP et par jour de WhatsTokenAI signifie qu'une exécution directe crée **une** clé.
- Lancez `--screen` dans l'un ou l'autre mode : il teste les sorties dont vous disposez (ou la route directe) contre `GET /api/v1/settings` avant une exécution réelle.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.jsonl` | e-mail / mot de passe / uid / id de jeton / solde cadeau / sortie / modèle / barrière — ignoré par git |
| `proxies.txt` | vos sorties — ignoré par git |
| `out/` | journaux d'exécution — ignoré par git |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
node src/cli.js --connect-9router      # same, from the CLI
```

Valeurs par défaut : `--prefix whatstoken`, `--base-url https://www.whatstoken.ai/v1`, `--model deepseek-v4.1-flash-1017`. Les modèles sont servis sous `whatstoken/<model id>`.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **WhatsTokenAI** — [whatstoken.ai](https://www.whatstoken.ai) |
| 🎁 Ce que le fournisseur offre | 0,1 $ de `gift_balance` à l'inscription (inscription par e-mail sans captcha) |
| 🔑 Ce qu'une clé vous apporte | une clé sur son propre compte, vérifiée par chat sur `deepseek-v4.1-flash-1017` |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://www.whatstoken.ai/v1/chat/completions` |
| 🔒 Vos données | seuls `www.whatstoken.ai` et votre backend de boîte mail sont contactés |

## 🐞 Problèmes

Si WhatsTokenAI modifie ses barrières d'inscription, sa politique d'adresses ou le cadeau d'inscription, l'outil s'arrête à cette étape et indique laquelle. **[Ouvrez un ticket](../../issues)** avec la commande et la sortie exacte.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 whatstoken-bulk-apikey contributors

</div>