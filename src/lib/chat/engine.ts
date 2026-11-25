import { aboutStats } from "@/content/about";
import { founder } from "@/content/founder";
import { clients } from "@/content/projects";
import { siteConfig } from "@/lib/site";

/**
 * Motor de respostas do assistente YAW (Powered by ChatUs).
 *
 * Funciona sem servidor nem custos: reconhece a intenção da mensagem por
 * palavras-chave e responde a partir da base de conhecimento abaixo.
 * Para usar o motor de IA da ChatUs, defina CHATUS_WEBHOOK_URL (ver
 * src/app/api/chat/route.ts) — esta base continua a servir de recurso.
 */

export type ChatLink = { label: string; href: string };
export type QuickReply = { label: string; action?: "lead" | "message" };

export type BotReply = {
  intent: string;
  text: string;
  links?: ChatLink[];
  quickReplies?: QuickReply[];
};

const { contact, location, socials, partner } = siteConfig;
const social = (label: string) => socials.find((s) => s.label === label);

const stat = (label: string) => aboutStats.find((s) => s.label === label)?.value;

const QR = {
  services: { label: "Serviços" },
  lead: { label: "Pedir proposta", action: "lead" as const },
  portfolio: { label: "Ver portefólio" },
  human: { label: "Falar com a equipa" },
  contacts: { label: "Contactos" },
};

const contactLinks: ChatLink[] = [
  { label: "Enviar e-mail", href: `mailto:${contact.email}` },
  { label: "Ligar", href: contact.phoneHref },
  ...["Instagram", "Facebook", "LinkedIn"].flatMap((l) => {
    const s = social(l);
    return s ? [{ label: s.label, href: s.href }] : [];
  }),
];

export const WELCOME: BotReply = {
  intent: "welcome",
  text: "Olá! Sou o assistente da YAW Media Agency. Posso apresentar os nossos serviços, mostrar o portefólio ou preparar já um pedido de proposta. Como posso ajudar?",
  quickReplies: [QR.services, QR.lead, QR.portfolio, QR.human],
};

type Intent = { id: string; keywords: string[]; reply: () => BotReply };

/** Ordem = prioridade em caso de empate. */
const intents: Intent[] = [
  {
    id: "proposta",
    keywords: [
      "preco",
      "precos",
      "orcamento",
      "quanto custa",
      "custa",
      "custo",
      "valor",
      "proposta",
      "cotacao",
      "tabela",
      "pacote",
      "plano",
    ],
    reply: () => ({
      intent: "proposta",
      text: "Cada projeto é orçamentado à medida, consoante os objetivos, o âmbito e os prazos — por isso não trabalhamos com uma tabela fixa. Posso recolher já alguns dados para a equipa preparar a sua proposta. Demora menos de um minuto.",
      quickReplies: [{ label: "Sim, vamos a isso", action: "lead" }, QR.human],
    }),
  },
  {
    id: "branding",
    keywords: [
      "branding",
      "marca",
      "logo",
      "logotipo",
      "identidade",
      "manual de normas",
      "rebranding",
      "naming",
      "embalagem",
      "packaging",
      "design grafico",
    ],
    reply: () => ({
      intent: "branding",
      text: "No branding construímos a marca de ponta a ponta: estratégia, naming, identidade visual, manual de normas e aplicações como packaging e design editorial. O resultado é uma marca coerente e memorável em todos os pontos de contacto.",
      links: [{ label: "Ver serviços", href: "#servicos" }],
      quickReplies: [QR.lead, QR.portfolio, { label: "Outros serviços" }],
    }),
  },
  {
    id: "social",
    keywords: [
      "redes sociais",
      "rede social",
      "social media",
      "instagram",
      "facebook",
      "tiktok",
      "conteudo",
      "conteudos",
      "posts",
      "publicacoes",
      "video",
      "videos",
      "fotografia",
      "reels",
      "comunidade",
    ],
    reply: () => ({
      intent: "social",
      text: "Gerimos redes sociais com calendário editorial, produção de conteúdo (fotografia, vídeo e motion), copywriting e gestão de comunidade — sempre com relatórios para medir o que funciona.",
      links: [{ label: "Ver serviços", href: "#servicos" }],
      quickReplies: [QR.lead, QR.portfolio, { label: "Outros serviços" }],
    }),
  },
  {
    id: "campanhas",
    keywords: [
      "campanha",
      "campanhas",
      "anuncio",
      "anuncios",
      "ads",
      "trafego",
      "publicidade",
      "patrocinado",
      "leads",
      "vendas",
      "marketing digital",
      "estrategia",
      "meta",
      "google",
    ],
    reply: () => ({
      intent: "campanhas",
      text: "Planeamos e gerimos campanhas de publicidade digital em Meta, Google, TikTok e LinkedIn, com funis de conversão, testes de criativos e relatórios de desempenho — tudo orientado para gerar leads e vendas.",
      links: [{ label: "Ver serviços", href: "#servicos" }],
      quickReplies: [QR.lead, QR.portfolio, { label: "Outros serviços" }],
    }),
  },
  {
    id: "web",
    keywords: [
      "site",
      "sites",
      "website",
      "websites",
      "web",
      "loja online",
      "e-commerce",
      "ecommerce",
      "landing",
      "pagina",
      "aplicacao",
      "app",
      "seo",
    ],
    reply: () => ({
      intent: "web",
      text: "Desenhamos e desenvolvemos websites institucionais, landing pages e lojas online — rápidos, preparados para telemóvel e otimizados para SEO e conversão.",
      links: [{ label: "Ver serviços", href: "#servicos" }],
      quickReplies: [QR.lead, QR.portfolio, { label: "Outros serviços" }],
    }),
  },
  {
    id: "servicos",
    keywords: [
      "servico",
      "servicos",
      "o que fazem",
      "fazem",
      "oferecem",
      "trabalham com",
      "outros servicos",
      "areas",
      "solucoes",
    ],
    reply: () => ({
      intent: "servicos",
      text: "Trabalhamos em quatro áreas que se complementam:\n• Estratégia de marketing digital e gestão de campanhas\n• Branding, identidade visual e design gráfico\n• Produção de conteúdo e social media\n• Desenvolvimento web e soluções digitais\nSobre qual quer saber mais?",
      links: [{ label: "Ver serviços", href: "#servicos" }],
      quickReplies: [
        { label: "Branding" },
        { label: "Redes sociais" },
        { label: "Campanhas" },
        { label: "Websites" },
      ],
    }),
  },
  {
    id: "portefolio",
    keywords: [
      "portefolio",
      "portfolio",
      "trabalhos",
      "projetos",
      "projectos",
      "casos",
      "exemplos",
      "ver portefolio",
    ],
    reply: () => ({
      intent: "portefolio",
      text: "Desenvolvemos marcas e websites como a StreamOut, a ChatUs e o Group WEDAT S.A., e campanhas como os 11 anos do Banco YETU — com um convite digital que registava cada confirmação de presença. Veja tudo na secção Portefólio.",
      links: [{ label: "Abrir portefólio", href: "#portefolio" }],
      quickReplies: [QR.lead, QR.services],
    }),
  },
  {
    id: "clientes",
    keywords: [
      "clientes",
      "cliente",
      "com quem trabalham",
      "com quem trabalhaste",
      "marcas que trabalham",
      "referencias",
    ],
    reply: () => {
      const names = clients.map((c) => c.name);
      return {
        intent: "clientes",
        text: `Trabalhamos com marcas como ${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}. Também desenvolvemos as marcas e os websites da StreamOut, da ChatUs e do Group WEDAT S.A.`,
        links: [{ label: "Ver portefólio", href: "#portefolio" }],
        quickReplies: [QR.lead, QR.services],
      };
    },
  },
  {
    id: "fundador",
    keywords: [
      "fundador",
      "fundou",
      "dono",
      "ceo",
      "diretor",
      "director",
      "diretor-geral",
      "walcyr",
      "tunguno",
      "quem manda",
      "lider",
    ],
    reply: () => ({
      intent: "fundador",
      text: `A YAW Media Agency foi fundada por ${founder.name}, que é também o seu Diretor-Geral. À frente da agência, alia visão de negócio, criatividade e tecnologia.`,
      links: [{ label: "Conhecer o fundador", href: "#fundador" }],
      quickReplies: [QR.services, QR.portfolio, QR.lead],
    }),
  },
  {
    id: "contacto",
    keywords: [
      "contacto",
      "contactos",
      "contato",
      "telefone",
      "numero",
      "email",
      "e-mail",
      "ligar",
      "whatsapp",
      "morada",
      "endereco",
      "onde ficam",
      "onde estao",
      "localizacao",
      "localizados",
      "escritorio",
      "linkedin",
      "vosso instagram",
      "vosso facebook",
      "vossa pagina",
      "redes da yaw",
      "seguir",
    ],
    reply: () => ({
      intent: "contacto",
      text: `Pode falar connosco diretamente:\nE-mail: ${contact.email}\nTelefone: ${contact.phone}\nMorada: ${location.street}, ${location.city}\nRespondemos, em média, em 24 horas.`,
      links: contactLinks,
      quickReplies: [QR.lead, QR.services],
    }),
  },
  {
    id: "tempo",
    keywords: [
      "quanto tempo",
      "prazo",
      "prazos",
      "demora",
      "demoram",
      "resposta",
      "respondem",
      "rapido",
      "urgente",
    ],
    reply: () => ({
      intent: "tempo",
      text: "Respondemos, em média, em 24 horas. Os prazos de cada projeto dependem do âmbito e são definidos consigo na proposta.",
      quickReplies: [QR.lead, QR.human],
    }),
  },
  {
    id: "sobre",
    keywords: ["quem sao", "sobre", "yaw", "agencia", "experiencia", "anos", "historia", "equipa yaw"],
    reply: () => ({
      intent: "sobre",
      text: `A YAW Media Agency transforma estratégia em comunicação com impacto. Estamos no mercado há mais de ${stat("Anos de mercado") ?? 5} anos, com mais de ${stat("Projetos entregues") ?? 50} projetos entregues e mais de ${stat("Marcas acompanhadas") ?? 15} marcas acompanhadas. Mais do que uma agência, somos um parceiro que complementa e fortalece a sua equipa.`,
      links: [{ label: "Sobre nós", href: "#sobre" }],
      quickReplies: [QR.services, QR.portfolio, QR.lead],
    }),
  },
  {
    id: "chatus",
    keywords: [
      "chatus",
      "chat us",
      "call center",
      "atendimento",
      "chatbot",
      "bot",
      "robo",
      "assistente",
      "inteligencia artificial",
      "ia",
      "es humano",
      "quem es",
    ],
    reply: () => ({
      intent: "chatus",
      text: `Sou um assistente virtual, powered by ${partner.name} — a empresa parceira da YAW especializada em atendimento ao cliente, suporte comercial e automação com IA. Se preferir, passo o seu contacto à equipa.`,
      links: [{ label: `Conhecer a ${partner.name}`, href: "#chatus" }],
      quickReplies: [{ label: "Deixar os meus dados", action: "lead" }, QR.services],
    }),
  },
  {
    id: "humano",
    keywords: [
      "humano",
      "pessoa",
      "falar com alguem",
      "falar com a equipa",
      "atendente",
      "equipa",
      "comercial",
      "consultor",
      "reuniao",
      "marcar",
    ],
    reply: () => ({
      intent: "humano",
      text: "Claro! Pode contactar a equipa por e-mail ou telefone, ou deixar aqui os seus dados e entramos em contacto consigo.",
      links: contactLinks.slice(0, 2),
      quickReplies: [{ label: "Deixar os meus dados", action: "lead" }],
    }),
  },
  {
    id: "saudacao",
    keywords: ["ola", "bom dia", "boa tarde", "boa noite", "hey", "oi", "hello", "viva", "boas"],
    reply: () => ({
      intent: "saudacao",
      text: "Olá! Em que posso ajudar? Posso falar-lhe dos serviços, do portefólio ou preparar um pedido de proposta.",
      quickReplies: [QR.services, QR.lead, QR.portfolio],
    }),
  },
  {
    id: "agradecimento",
    keywords: [
      "obrigado",
      "obrigada",
      "agradeco",
      "valeu",
      "adeus",
      "ate logo",
      "ate breve",
      "tchau",
      "perfeito",
      "otimo",
    ],
    reply: () => ({
      intent: "agradecimento",
      text: "Sempre às ordens! Se precisar de mais alguma coisa, estou por aqui.",
      quickReplies: [QR.services, QR.lead],
    }),
  },
];

const FALLBACK: BotReply = {
  intent: "fallback",
  text: "Não tenho a certeza de ter percebido. Posso ajudar com os nossos serviços, o portefólio e os contactos, ou preparar um pedido de proposta — também posso encaminhar a sua questão para a equipa.",
  quickReplies: [QR.services, QR.lead, QR.contacts, QR.human],
};

/** minúsculas, sem acentos nem pontuação */
export function normalize(input: string) {
  return ` ${input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9@\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

export function getBotReply(message: string): BotReply {
  const text = normalize(message);
  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    let score = 0;
    for (const k of intent.keywords) {
      // Palavras inteiras (ou expressões) — evita "ia" dentro de "media"
      if (text.includes(` ${k} `)) score += k.includes(" ") ? 2 : 1;
    }
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }

  return best ? best.reply() : FALLBACK;
}
