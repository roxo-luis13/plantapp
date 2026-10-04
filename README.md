# 🌱 Meu Jardim

Catálogo pessoal de plantas: cadastre cada planta com foto do dia da compra,
data de compra e nome. Uma IA identifica a espécie pela foto e outra gera
dicas de cuidado (rega, luz, solo, toxicidade etc.) automaticamente. Cada
pessoa que entra (com Google ou e-mail/senha) tem o próprio catálogo,
isolado dos outros usuários.

Feito 100% com serviços gratuitos:

- **[Next.js](https://nextjs.org/)** (App Router) — hospedado grátis na [Vercel](https://vercel.com/).
- **[Supabase](https://supabase.com/)** (plano free) — banco de dados Postgres, storage das fotos e autenticação (Google + e-mail/senha).
- **[Pl@ntNet](https://my.plantnet.org/)** (API gratuita) — identificação da espécie a partir da foto.
- **[Google Gemini](https://aistudio.google.com/apikey)** (API free tier) — geração das dicas de cuidado a partir do nome identificado.

## 1. Criar as contas gratuitas

1. **Supabase**: crie um projeto em [supabase.com](https://supabase.com/dashboard). Em
   *Project Settings → API* copie a `Project URL` e a `anon public key`.
2. **Pl@ntNet**: crie uma conta em [my.plantnet.org](https://my.plantnet.org/) e gere uma
   API key gratuita em *My API Keys*.
3. **Gemini**: gere uma API key gratuita em [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

## 2. Configurar o banco de dados

No painel do Supabase, abra o **SQL Editor** e rode, nessa ordem, o conteúdo de:

1. [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
2. [`supabase/migrations/0002_add_multi_user.sql`](./supabase/migrations/0002_add_multi_user.sql)

Isso cria:

- a tabela `plants` (dono, nome, nome científico, data de compra, foto, notas, cuidados em JSON);
- o bucket de storage `plant-photos` (fotos públicas para leitura, upload/remoção restritos ao dono);
- políticas de RLS: cada usuário só vê e edita as próprias plantas.

## 3. Configurar o login

### E-mail e senha

Em **Authentication → Providers → Email**, desmarque **Confirm email**. Sem
isso, criar conta depende do serviço de e-mail gratuito do Supabase, que
tem um limite bem baixo de envios por hora.

### Login com Google

1. No [Google Cloud Console](https://console.cloud.google.com/), crie um
   projeto (ou use um existente) e vá em **APIs & Services → Credentials**.
2. **Create Credentials → OAuth client ID**, tipo **Web application**.
3. Em **Authorized redirect URIs**, adicione a URL de callback que o
   Supabase mostra em **Authentication → Providers → Google** (algo como
   `https://<seu-projeto>.supabase.co/auth/v1/callback`).
4. Copie o **Client ID** e o **Client Secret** gerados e cole em
   **Authentication → Providers → Google** no Supabase, habilitando o provedor.

### URL Configuration

Em **Authentication → URL Configuration**:

- **Site URL**: a URL onde o app está publicado (ex: `https://seu-app.vercel.app`).
- **Redirect URLs**: adicione `https://seu-app.vercel.app/auth/callback` e,
  para testar local, `http://localhost:3000/auth/callback`.

## 4. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com as chaves obtidas acima:

```bash
cp .env.example .env.local
```

## 5. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000), entre com Google ou
crie uma conta com e-mail/senha, e comece a cadastrar plantas.

## 6. Deploy gratuito

1. Suba o repositório no GitHub (já está feito, se você está lendo isso por aqui).
2. Importe o projeto na [Vercel](https://vercel.com/new) (plano free).
3. Configure as mesmas variáveis de `.env.local` em *Project Settings → Environment Variables*.
4. Deploy. O app é uma PWA — no celular, abra pelo navegador e use "Adicionar à tela inicial".

## Como funciona a IA

- **Identificação**: ao enviar a foto no cadastro, o botão "Identificar planta
  com IA" chama `/api/identify`, que envia a imagem para o Pl@ntNet e retorna
  as espécies mais prováveis para você escolher.
- **Cuidados**: ao salvar a planta (ou clicar em "Buscar dicas de cuidado"),
  o nome é enviado ao Gemini, que devolve um JSON estruturado com rega, luz,
  temperatura, solo/adubo, umidade, toxicidade, problemas comuns e dicas
  extras — tudo em português.

## Limites do plano gratuito

- Pl@ntNet: 500 identificações/dia **no total**, somando todos os usuários —
  é uma única API key compartilhada pelo app inteiro.
- Gemini free tier: limite de requisições por minuto/dia, também compartilhado
  entre todos os usuários da mesma API key.
- Supabase free: 500 MB de banco e 1 GB de storage — dá para muitas plantas
  com fotos comprimidas pelo celular, mas o projeto é pausado automaticamente
  depois de um tempo sem uso (basta reativar no painel do Supabase quando
  isso acontecer).

> Com várias pessoas usando o app, essas cotas compartilhadas podem esgotar
> rápido. Se isso virar um problema, vale considerar limitar quantas
> identificações/perguntas cada usuário pode fazer por dia.

## Estrutura do projeto

```
src/
  app/
    page.tsx              # dashboard com o catálogo
    login/                  # tela de login (Google + e-mail/senha)
    auth/callback/           # troca o code do OAuth pela sessão
    plants/new/               # formulário de cadastro (foto + identificação)
    plants/[id]/               # detalhe da planta + cuidados
    api/identify/              # rota que chama o Pl@ntNet
    api/care/                  # rota que chama o Gemini
    actions.ts                 # server actions (criar/remover planta, cuidados)
  components/                  # UI (form, card, cuidados, botões)
  lib/
    supabase/                  # clientes Supabase (browser/server/middleware)
    plantnet.ts                 # integração Pl@ntNet
    gemini.ts                    # integração Gemini
  proxy.ts                        # protege as páginas, redireciona pra /login
supabase/migrations/
  0001_init.sql              # schema inicial
  0002_add_multi_user.sql      # dono por planta + RLS por usuário
```
