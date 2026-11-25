# YAW Media Agency — Website institucional e portefólio

Website da **YAW Media Agency** em **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** e **Framer Motion**. Dark mode nativo, mobile-first, animações fluidas, otimizado para SEO e pronto a publicar no **Netlify**.

> 🚀 **Para pôr o site online, siga o guia [Publicar no Netlify](#publicar-no-netlify-passo-a-passo)** no fim deste ficheiro.

## Começar

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | O que faz                         |
| ------------------- | --------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento       |
| `npm run build`     | Build de produção                 |
| `npm start`         | Servir o build de produção        |
| `npm run lint`      | ESLint                            |
| `npm run typecheck` | Verificação de tipos (TypeScript) |
| `npm run format`    | Formatar com Prettier             |

Requer Node.js 20.9 ou superior (o Netlify usa o Node 22, definido em `netlify.toml`).

## Estrutura

```
src/
├── app/
│   ├── layout.tsx            # Fontes, metadados SEO, navbar e footer
│   ├── page.tsx              # Página principal (composição das secções)
│   ├── globals.css           # Design tokens Tailwind v4 (cores, fontes, animações)
│   ├── api/contact/route.ts  # Alternativa ao Netlify Forms (desenvolvimento / Resend)
│   ├── api/chat/route.ts     # Ponte opcional para o motor de IA da ChatUs
│   ├── opengraph-image.tsx   # Imagem de partilha gerada no build
│   ├── sitemap.ts · robots.ts · manifest.ts · icon.svg · apple-icon.png
│   └── not-found.tsx
├── components/
│   ├── layout/    Navbar · Footer (retícula) · JsonLd (schema.org)
│   ├── sections/  Hero · Services · Portfolio · About · Founder · NextStep · Partner (ChatUs) · Contact
│   ├── portfolio/ ProjectDialog (janela de detalhe do projeto)
│   ├── chat/      ChatWidget (assistente) · ChatDemo · OpenChatButton
│   ├── contact/   ContactForm (validação em tempo real, estados de envio)
│   ├── motion/    Reveal · ScrollRevealText · Counter · DrawLine · ParallaxImage · Providers
│   ├── visuals/   HalftoneWordmark (retícula do hero) · ServiceIcon
│   └── ui/        halftone-wordmark-footer · Button · Logo · Slash · Eyebrow · GridLines · Marquee
├── content/       services.ts · projects.ts · about.ts · founder.ts   ← textos editáveis
├── assets/        imagens do fundador, do portefólio e dos parceiros
├── lib/           site.ts (contactos, redes, parceiro, navegação) · chat/ (motor do assistente)
│                  validation.ts · contact-client.ts (envio dos pedidos) · fonts.ts · utils.ts
└── fonts/         Plus Jakarta Sans + JetBrains Mono (Google Fonts, OFL, self-hosted)

public/
├── __forms.html                 # Registo do formulário no Netlify Forms (não é uma página)
├── brand/                       # Logótipo YAW em SVG
└── casos/banco-yetu-11-anos/    # Convite digital (demonstração)

netlify.toml                     # Build e versão do Node no Netlify
```

## Editar conteúdos

Todo o texto vive em ficheiros simples — não é preciso mexer nos componentes:

- **Contactos, morada, redes sociais, empresa parceira e URL** → `src/lib/site.ts`
- **Serviços** → `src/content/services.ts`
- **Projetos do portefólio e marcas com quem trabalhamos (com website, Instagram e Facebook)** → `src/content/projects.ts`
  Coloque as imagens em `src/assets/portfolio/<projeto>/`, importe-as no topo do ficheiro e acrescente o projeto à lista. Cada cartão abre uma janela com o texto completo e a galeria.
- **Fundador** → `src/content/founder.ts` (retrato a preto e branco em `src/assets/founder/`)
- **Convite digital Banco YETU 11 anos** → `public/casos/banco-yetu-11-anos/convite.html` (versão de demonstração; servida em `/casos/banco-yetu-11-anos/convite.html`)
- **Sobre nós, números e processo** → `src/content/about.ts`
- **Respostas do assistente de chat** → `src/lib/chat/engine.ts`

> ⚠️ **Antes de publicar:** reveja a biografia do fundador (`src/content/founder.ts`) e os textos dos projetos.

## Identidade visual

Os tokens estão em `src/app/globals.css` (bloco `@theme`) e geram utilitários Tailwind automaticamente:

| Token            | Valor             | Uso                               |
| ---------------- | ----------------- | --------------------------------- |
| `ink`            | `#0B0B0B`         | Fundo principal                   |
| `paper`          | `#FFFFFF`         | Secções de contraste              |
| `brand-500`      | `#1ECC99`         | Verde YAW (acento do logótipo)    |
| `brand-50…950`   | escala            | Variações do verde                |
| `mist` / `stone` | cinzas            | Texto secundário (escuro / claro) |
| `font-sans`      | Plus Jakarta Sans | Títulos e texto                   |
| `font-mono`      | JetBrains Mono    | Etiquetas e números               |

Utilitários próprios: `container-x`, `eyebrow`, `glass`, `hatch`, `grain`, `text-outline`.

O logótipo foi vectorizado (`src/components/ui/Logo.tsx`) — usa `currentColor`, por isso basta `text-white` ou `text-ink`. Versões soltas em `public/brand/`.

## Animação de retícula (hero e rodapé)

- **Rodapé:** `src/components/ui/halftone-wordmark-footer.tsx` — componente original, sem alterações; é configurado em `src/components/layout/Footer.tsx` (palavra "yaw media", cores da YAW, colunas de links).
- **Hero:** `src/components/visuals/HalftoneWordmark.tsx` — a mesma retícula (reutiliza as funções exportadas pelo rodapé) com fundo transparente e animação de entrada; a palavra "yaw" assenta no fundo da secção.

O rato afasta os pontos (que aquecem para o verde da marca) e o clique solta uma onda. Com "reduzir movimento" ativo, a palavra fica parada.

## Formulário de contacto

O formulário valida no browser (`src/lib/validation.ts`) e inclui proteção anti-spam (campo-isco invisível). Os pedidos do formulário **e** do assistente de chat seguem pelo mesmo caminho (`src/lib/contact-client.ts`):

- **No Netlify (por defeito): Netlify Forms.** Sem chaves nem servidor de e-mail. O formulário "contacto" está registado em `public/__forms.html`; cada pedido aparece no painel do Netlify (**Forms**) e pode ser enviado por e-mail (ver guia abaixo). O assunto indica o nome, a empresa e o serviço; o campo "origem" diz se veio do formulário ou do assistente.
- **Em desenvolvimento** (`npm run dev`): os pedidos vão para `/api/contact` e aparecem no terminal.
- **Alternativa — Resend:** com `NEXT_PUBLIC_CONTACT_PROVIDER=api` e as variáveis do Resend (ver `.env.example`), os pedidos são enviados por e-mail através de `/api/contact`. Exige um domínio próprio verificado no Resend.

> Se acrescentar um campo ao formulário, acrescente-o também em `public/__forms.html`.

## Assistente de chat (Powered by ChatUs)

O botão flutuante abre o assistente, que:

- responde a perguntas sobre serviços, preços, portefólio, contactos, prazos e a ChatUs;
- encaminha para as secções do site e para e-mail, telefone, Instagram, Facebook e LinkedIn;
- recolhe pedidos de proposta passo a passo (nome → e-mail → serviço → descrição) e envia-os tal como o formulário (Netlify Forms), com a origem "Assistente de chat".

Por defeito responde no próprio browser com a base de conhecimento de `src/lib/chat/engine.ts` (sem servidor e sem custos). Para o ligar ao motor de IA da ChatUs, defina `NEXT_PUBLIC_CHAT_MODE=remote` e `CHATUS_WEBHOOK_URL` (opcionalmente `CHATUS_API_KEY`): a rota `/api/chat` envia `{ source, message, history }` e espera `{ "reply": "texto" }`. Se a ChatUs não responder, entra a base local.

Qualquer botão pode abrir o assistente com `openChat()` (`src/lib/chat/open-chat.ts`); com `openChat({ lead: true })` começa logo o pedido de proposta.

## Acessibilidade e performance

- HTML semântico, link "Saltar para o conteúdo", foco visível, `aria-*` no menu, filtros e formulário.
- Respeita `prefers-reduced-motion` (animações e canvas desligam-se).
- Título do hero animado em CSS (aparece no primeiro frame, sem esperar pelo JavaScript).
- As animações de retícula só desenham quando algo se mexe e pausam fora do ecrã.
- O assistente de chat é um `dialog` acessível (foco, Escape, `aria-live` nas mensagens).
- Fontes servidas localmente via `next/font` (sem pedidos externos nem layout shift).

## Publicar no Netlify (passo a passo)

O projeto já está configurado para o Netlify (`netlify.toml`): o Netlify deteta o Next.js, instala o adaptador oficial e publica o site sem mais configuração. **Não é preciso definir nenhuma variável de ambiente.**

### 1. Colocar o projeto no GitHub

A forma mais simples é a aplicação **GitHub Desktop** (o carregamento pelo browser não lida bem com muitas pastas e ficheiros).

1. Descompacte o ZIP numa pasta (ex.: `Documentos/yaw-media-agency`).
2. Instale o [GitHub Desktop](https://desktop.github.com/) e entre com a sua conta GitHub.
3. **File → Add local repository…** → escolha a pasta `yaw-media-agency`.
4. Aparece o aviso de que a pasta ainda não é um repositório: clique em **create a repository** → **Create repository**.
5. Clique em **Publish repository**. Pode deixar **Keep this code private** ativado — o Netlify funciona com repositórios privados.

A pasta `node_modules` e os ficheiros de build não vão para o GitHub (estão no `.gitignore`); o Netlify instala tudo sozinho.

### 2. Ligar o repositório ao Netlify

**Se já tem o projeto `yaw-media-agency` no Netlify** (para manter o endereço `yaw-media-agency.netlify.app`): abra esse projeto → **Project configuration → Build & deploy → Continuous deployment → Link repository** → GitHub → escolha o repositório.

**Se vai criar um projeto novo:** **Add new project → Import an existing project → GitHub** → autorize o acesso → escolha o repositório.

Em ambos os casos, confirme as definições (já vêm preenchidas pelo `netlify.toml`):

| Campo             | Valor           |
| ----------------- | --------------- |
| Build command     | `npm run build` |
| Publish directory | `.next`         |

Clique em **Deploy**. O primeiro deploy demora 1–3 minutos.

### 3. Ativar os formulários e as notificações por e-mail

1. **Project configuration → Forms** → **Enable form detection**.
2. Faça um novo deploy para o Netlify registar o formulário: **Deploys → Trigger deploy → Deploy project**.
3. Em **Forms** deve aparecer o formulário **contacto**.
4. **Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**: e-mail `yaw.media.agency@gmail.com`, formulário `contacto` → **Save**.
5. Envie um pedido de teste pelo site (formulário e assistente) e confirme que chega ao e-mail — veja também a pasta de spam na primeira vez.

### 4. Domínio próprio (opcional)

**Domain management → Add a domain** e siga as instruções para apontar o DNS. O Netlify ativa o HTTPS automaticamente. O SEO (sitemap, partilhas) passa a usar o domínio principal sem mudar código.

### Atualizar o site

Edite os ficheiros → no GitHub Desktop escreva um resumo da alteração → **Commit to main** → **Push origin**. O Netlify publica a nova versão automaticamente.
