# 🌱 Meu Jardim

Catálogo pessoal de plantas: cadastre cada planta com foto do dia da compra,
data de compra e nome. Uma IA identifica a espécie pela foto e outra gera
dicas de cuidado (rega, luz, solo, toxicidade etc.) automaticamente.

Feito 100% com serviços gratuitos:

- **[Next.js](https://nextjs.org/)** (App Router) — hospedado grátis na [Vercel](https://vercel.com/).
- **[Supabase](https://supabase.com/)** (plano free) — banco de dados Postgres e storage das fotos.
- **[Pl@ntNet](https://my.plantnet.org/)** (API gratuita) — identificação da espécie a partir da foto.
- **[Google Gemini](https://aistudio.google.com/apikey)** (API free tier) — geração das dicas de cuidado a partir do nome identificado.

## 1. Criar as contas gratuitas

1. **Supabase**: crie um projeto em [supabase.com](https://supabase.com/dashboard). Em
   *Project Settings → API* copie a `Project URL` e a `anon public key`.
2. **Pl@ntNet**: crie uma conta em [my.plantnet.org](https://my.plantnet.org/) e gere uma
   API key gratuita em *My API Keys*.
3. **Gemini**: gere uma API key gratuita em [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

## 2. Configurar o banco de dados

No painel do Supabase, abra o **SQL Editor** e rode o conteúdo de
[`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql). Isso cria:

- a tabela `plants` (nome, nome científico, data de compra, foto, notas, cuidados em JSON);
- o bucket de storage `plant-photos` (leitura e escrita públicas);
- políticas de RLS abertas — este é um app de uso pessoal, sem login.

> ⚠️ Sem tela de login: qualquer pessoa com o link do app consegue ver e
> editar o catálogo. Combina com o uso pretendido (só você usando), mas não
> compartilhe a URL publicamente.

## 3. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com as chaves obtidas acima:

```bash
cp .env.example .env.local
```

## 4. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) e comece a cadastrar plantas.

## 5. Deploy gratuito

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

- Pl@ntNet: 500 identificações/dia no plano gratuito.
- Gemini free tier: limite de requisições por minuto/dia (suficiente para uso pessoal).
- Supabase free: 500 MB de banco e 1 GB de storage — dá para milhares de plantas com fotos comprimidas pelo celular.

## Estrutura do projeto

```
src/
  app/
    page.tsx              # dashboard com o catálogo
    plants/new/             # formulário de cadastro (foto + identificação)
    plants/[id]/             # detalhe da planta + cuidados
    api/identify/            # rota que chama o Pl@ntNet
    api/care/                # rota que chama o Gemini
    actions.ts               # server actions (criar/remover planta, cuidados)
  lib/
    supabase/                # cliente Supabase (server-side)
    plantnet.ts               # integração Pl@ntNet
    gemini.ts                  # integração Gemini
  components/                  # UI (form, card, cuidados, botões)
supabase/migrations/0001_init.sql  # schema do banco
```
