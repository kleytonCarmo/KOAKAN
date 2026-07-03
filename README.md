# AXON

Painel pessoal de prontidão (readiness) alimentado pelos seus dados do Whoop:
recuperação, sono, strain e evolução de composição corporal.

Feito com React + Vite. O backend do Whoop (OAuth 2.0) roda como funções
serverless na pasta `api/`, então o seu `client_secret` **nunca** aparece no
navegador.

---

## Como funciona

- **Frontend** (`src/`): interface e gráficos. Se o Whoop não estiver
  conectado, mostra dados de demonstração para você ver tudo funcionando.
- **Backend** (`api/whoop/`): faz o login OAuth com o Whoop, guarda a sessão
  num cookie assinado e `httpOnly`, e busca os dados reais. Renova o token
  automaticamente (o Whoop rotaciona o refresh token a cada uso).

---

## Rodar no seu computador (opcional)

Você não precisa disso para publicar, mas se quiser testar local:

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173` no **modo demonstração** (sem backend do
Whoop, que só roda depois de publicado na Vercel).

---

## Publicar — passo a passo

Vamos usar a **Vercel**, que conecta direto no GitHub, publica sozinha a cada
push e roda a pasta `api/` sem configuração extra. É de graça para uso pessoal.

### 1. Subir o código pro GitHub

Coloque todos estes arquivos no seu repositório (`axis-hub-v1` ou um novo).
Confira que o `.gitignore` está presente para não subir `node_modules`.

### 2. Criar o app no Whoop

1. Acesse **https://developer-dashboard.whoop.com** e faça login com sua conta
   Whoop.
2. Crie um novo app ("Create App").
3. Em **Redirect URI**, coloque por enquanto:
   `https://SEU-APP.vercel.app/api/whoop/callback`
   (você vai ajustar o domínio real no passo 4 — pode voltar e editar).
4. Selecione os **scopes**: `read:profile`, `read:recovery`, `read:sleep`,
   `read:cycles`, `read:workout`, `read:body_measurement` e `offline`.
5. Copie o **Client ID** e o **Client Secret** — você vai usar no passo 4.

### 3. Conectar o GitHub na Vercel

1. Acesse **https://vercel.com** e entre com o GitHub.
2. "Add New… → Project" e importe o seu repositório.
3. A Vercel detecta Vite sozinha. Não mude nada do build. **Ainda não clique
   em Deploy** — primeiro configure as variáveis (próximo passo).

### 4. Configurar as variáveis de ambiente

Na tela do projeto, em **Settings → Environment Variables**, adicione:

| Nome | Valor |
|------|-------|
| `WHOOP_CLIENT_ID` | o Client ID do passo 2 |
| `WHOOP_CLIENT_SECRET` | o Client Secret do passo 2 |
| `AXON_COOKIE_SECRET` | um valor aleatório longo (veja abaixo) |
| `APP_URL` | a URL final do app, ex. `https://axon.vercel.app` |

Para gerar o `AXON_COOKIE_SECRET`, rode no terminal:

```bash
openssl rand -hex 32
```

(ou use qualquer gerador de senha longa).

### 5. Publicar e fechar o ciclo

1. Clique em **Deploy**. Em ~1 minuto o app está no ar.
2. Copie a URL final que a Vercel te deu.
3. Se ela for diferente do que você colocou, volte no **Whoop Developer
   Dashboard** e ajuste o **Redirect URI** para
   `https://SUA-URL-REAL/api/whoop/callback`. Ajuste também o `APP_URL` na
   Vercel se precisar (isso força um novo deploy).

### 6. Conectar sua conta

Abra o app publicado → aba **Conexões** → **Conectar Whoop** → autorize.
Pronto: a prontidão passa a usar seus dados reais.

> Lembre: a recuperação do dia só aparece **depois** que um ciclo de sono é
> concluído. Durante o dia o Whoop não entrega recovery em tempo real.

---

## Alternativa: Cloudflare Pages

Funciona também, mas as funções serverless usam um formato um pouco diferente
(`functions/` com sintaxe própria). Se preferir a Cloudflare, me avise que eu
adapto a pasta `api/` para o padrão deles.

---

## Estrutura

```
api/
  _lib/whoop.js        Sessão assinada, OAuth e fetch autenticado
  whoop/login.js       Redireciona pra tela de consentimento do Whoop
  whoop/callback.js    Recebe o code e cria a sessão
  whoop/data.js        Busca recuperação, sono, strain e tendência
  whoop/logout.js      Desconecta
src/
  components/          Medidor, tiles, gráficos, sidebar, etc.
  pages/               Prontidão, Corpo, Conexões
  lib/                 Cálculo de prontidão e armazenamento local
  hooks/useWhoop.js    Carrega os dados (com fallback de demonstração)
  theme.css            Sistema de design (cores, fontes, componentes)
```
