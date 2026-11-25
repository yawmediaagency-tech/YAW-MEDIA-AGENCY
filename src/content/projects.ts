import type { StaticImageData } from "next/image";

// Banco YETU — 11 anos
import yetuKeyVisual from "@/assets/portfolio/yetu/key-visual.jpg";
import yetuLogo11 from "@/assets/portfolio/yetu/logo-11-anos.jpg";
import yetuConvite1 from "@/assets/portfolio/yetu/convite-1.jpg";
import yetuConvite3 from "@/assets/portfolio/yetu/convite-3.jpg";
import yetuConvite5 from "@/assets/portfolio/yetu/convite-5.jpg";
import yetuPalcoEcra from "@/assets/portfolio/yetu/palco-ecra.jpg";
import yetuPalcoSala from "@/assets/portfolio/yetu/palco-sala.jpg";
import yetuCaneca11 from "@/assets/portfolio/yetu/merch/caneca-11-anos.jpg";
import yetuCanecaLogo from "@/assets/portfolio/yetu/merch/caneca-logotipo.jpg";
import yetuTshirtPreta from "@/assets/portfolio/yetu/merch/tshirt-preta.jpg";
import yetuTshirtBranca from "@/assets/portfolio/yetu/merch/tshirt-branca.jpg";
import yetuBonePreto from "@/assets/portfolio/yetu/merch/bone-preto.jpg";
import yetuBoneBranco from "@/assets/portfolio/yetu/merch/bone-branco.jpg";
import yetuCalendarioDourado from "@/assets/portfolio/yetu/merch/calendario-dourado.jpg";
import yetuCalendarioVerde from "@/assets/portfolio/yetu/merch/calendario-verde.jpg";
import yetuPins from "@/assets/portfolio/yetu/merch/pins.jpg";
import yetuConviteImpresso from "@/assets/portfolio/yetu/merch/convite-impresso.jpg";
import yetuPulseiraVerde from "@/assets/portfolio/yetu/merch/pulseira-verde.jpg";
import yetuPulseiraDourada from "@/assets/portfolio/yetu/merch/pulseira-dourada.jpg";
// StreamOut
import streamoutCover from "@/assets/portfolio/streamout/cover.jpg";
import streamoutSlogan from "@/assets/portfolio/streamout/logo-slogan.jpg";
import streamoutSocial1 from "@/assets/portfolio/streamout/social-1.jpg";
import streamoutSocial2 from "@/assets/portfolio/streamout/social-2.jpg";
import streamoutSocial3 from "@/assets/portfolio/streamout/social-3.jpg";
import streamoutStory1 from "@/assets/portfolio/streamout/story-1.jpg";
import streamoutStory2 from "@/assets/portfolio/streamout/story-2.jpg";
import streamoutStory3 from "@/assets/portfolio/streamout/story-3.jpg";
// ChatUs
import chatusDark from "@/assets/portfolio/chatus/logo-dark.jpg";
import chatusLight from "@/assets/portfolio/chatus/logo-light.jpg";
import chatusIcon from "@/assets/portfolio/chatus/icon-blue.jpg";
// Group WEDAT
import wedatDark from "@/assets/portfolio/wedat/logo-dark.jpg";
import wedatIcon from "@/assets/portfolio/wedat/icon-dark.jpg";
import wedatLight from "@/assets/portfolio/wedat/logo-light.jpg";

/**
 * Portefólio da YAW: marcas desenvolvidas, websites e campanhas.
 * Para acrescentar um projeto, coloque as imagens em src/assets/portfolio/<projeto>/,
 * importe-as acima e acrescente um objeto à lista `projects`.
 */

export type ProjectCategory = "branding" | "campanhas" | "social" | "web";

export const projectCategories: { id: ProjectCategory | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "branding", label: "Branding" },
  { id: "campanhas", label: "Campanhas" },
  { id: "social", label: "Social Media" },
  { id: "web", label: "Websites" },
];

export type ProjectImage = {
  src: StaticImageData;
  alt: string;
};

export type Project = {
  slug: string;
  client: string;
  title: string;
  categories: ProjectCategory[];
  /** Selo no cartão (ex.: "Campanha em destaque") */
  badge?: string;
  /** Resumo curto, visível no cartão */
  summary: string;
  /** Texto completo, visível na janela do projeto */
  description: string[];
  services: string[];
  cover: ProjectImage & {
    position?: string;
    /** "contain" para logótipos: a imagem inteira fica visível sobre `background` */
    fit?: "cover" | "contain";
    background?: string;
  };
  gallery: ProjectImage[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "banco-yetu-11-anos",
    client: "Banco YETU",
    title: "11 anos — campanha comemorativa 360º",
    categories: ["campanhas", "branding", "web"],
    badge: "Campanha em destaque",
    summary:
      "Da identidade do aniversário ao palco do evento: key visual, merchandising, convites e um convite digital com confirmação de presença.",
    description: [
      "Para celebrar os 11 anos do Banco YETU, desenvolvemos toda a campanha comemorativa: a identidade do aniversário, o key visual, os conteúdos para o ecrã do palco no dia do evento e o merchandising — bonés, t-shirts, canecas, calendários, pins, pulseiras e o convite impresso.",
      "O ponto alto foi o convite digital interativo. Cada convidado abria o convite, descobria o programa, o dress code e a localização, e confirmava a presença no próprio convite — o seu nome ficava registado numa base de dados, com a hora exata da confirmação, dando à organização a lista de presenças em tempo real.",
    ],
    services: [
      "Conceito criativo",
      "Identidade comemorativa",
      "Key visual",
      "Ecrã do palco",
      "Merchandising",
      "Convite impresso",
      "Convite digital",
      "Base de dados RSVP",
    ],
    cover: {
      src: yetuKeyVisual,
      alt: "Key visual da campanha 11 anos do Banco YETU",
      position: "50% 42%",
    },
    gallery: [
      { src: yetuKeyVisual, alt: "Key visual — O Banco YETU faz 11 anos" },
      { src: yetuPalcoEcra, alt: "Ecrã do palco com a identidade dos 11 anos" },
      { src: yetuLogo11, alt: "Identidade comemorativa dos 11 anos" },
      { src: yetuPalcoSala, alt: "Palco do evento com o ecrã dos 11 anos" },
      { src: yetuCaneca11, alt: "Caneca dos 11 anos" },
      { src: yetuTshirtPreta, alt: "T-shirt preta dos 11 anos" },
      { src: yetuCalendarioVerde, alt: "Calendário de secretária, versão verde" },
      { src: yetuBonePreto, alt: "Boné preto dos 11 anos" },
      { src: yetuPins, alt: "Pins dos 11 anos" },
      { src: yetuConviteImpresso, alt: "Convite impresso" },
      { src: yetuTshirtBranca, alt: "T-shirt branca dos 11 anos" },
      { src: yetuPulseiraVerde, alt: "Pulseira do evento, versão verde" },
      { src: yetuCanecaLogo, alt: "Caneca com o logótipo Banco YETU" },
      { src: yetuCalendarioDourado, alt: "Calendário de secretária, versão dourada" },
      { src: yetuBoneBranco, alt: "Boné branco dos 11 anos" },
      { src: yetuPulseiraDourada, alt: "Pulseira do evento, versão dourada" },
      { src: yetuConvite1, alt: "Convite digital — abertura" },
      { src: yetuConvite3, alt: "Convite digital — informações do evento" },
      { src: yetuConvite5, alt: "Convite digital — confirmação de presença" },
    ],
    links: [{ label: "Abrir o convite digital", href: "/casos/banco-yetu-11-anos/convite.html" }],
  },
  {
    slug: "streamout",
    client: "StreamOut",
    title: "Identidade visual, website e redes sociais",
    categories: ["branding", "web", "social"],
    summary:
      "Marca de assinaturas e gift cards de entretenimento: logótipo, website e conteúdos para redes sociais.",
    description: [
      "Criámos a marca StreamOut de raiz — um logótipo em que o “O” se transforma no botão play, um sistema cromático em azul e a assinatura “Oferecendo o melhor do entretenimento”.",
      "Desenvolvemos também o website e criámos conteúdos para as redes sociais, como as séries “Artistas para ouvir”, com o Spotify, e as sugestões da semana na Apple Music.",
    ],
    services: ["Logótipo", "Identidade visual", "Website", "Social media", "Design de conteúdos"],
    cover: {
      src: streamoutCover,
      alt: "Logótipo StreamOut sobre fundo azul",
      fit: "contain",
      position: "50% 38%",
      background: "linear-gradient(135deg,#015eea 0%,#0080db 50%,#009ecd 100%)",
    },
    gallery: [
      { src: streamoutCover, alt: "Logótipo StreamOut" },
      { src: streamoutSlogan, alt: "Logótipo StreamOut com assinatura" },
      { src: streamoutSocial1, alt: "Post — Artistas para ouvir" },
      { src: streamoutSocial2, alt: "Post — Artistas para ouvir no Spotify" },
      { src: streamoutSocial3, alt: "Post — Artistas para ouvir no Spotify" },
      { src: streamoutStory1, alt: "Story — Artistas para ouvir" },
      { src: streamoutStory2, alt: "Story — Sugestões da semana na Apple Music" },
      { src: streamoutStory3, alt: "Story — Artistas para ouvir" },
    ],
  },
  {
    slug: "chatus",
    client: "ChatUs",
    title: "Identidade visual e website",
    categories: ["branding", "web"],
    summary:
      "Call center digital em Angola: um balão de conversa que sorri, como símbolo de um atendimento próximo.",
    description: [
      "A ChatUs é um call center digital em Angola, especializado em atendimento ao cliente, suporte comercial e automação com inteligência artificial.",
      "Desenvolvemos a identidade — o balão de conversa com um sorriso, em azul — e o website da marca.",
    ],
    services: ["Logótipo", "Identidade visual", "Website"],
    cover: {
      src: chatusDark,
      alt: "Logótipo ChatUs sobre fundo escuro",
      fit: "contain",
      position: "50% 38%",
      background: "#0b1220",
    },
    gallery: [
      { src: chatusDark, alt: "Logótipo ChatUs — versão para fundo escuro" },
      { src: chatusLight, alt: "Logótipo ChatUs — versão principal" },
      { src: chatusIcon, alt: "Símbolo ChatUs sobre azul" },
    ],
  },
  {
    slug: "group-wedat",
    client: "Group WEDAT S.A.",
    title: "Identidade institucional e website",
    categories: ["branding", "web"],
    summary: "Holding de gestão financeira e de ativos: uma identidade institucional em preto e dourado.",
    description: [
      "O Group WEDAT S.A. — Financial & Assets Management é uma holding dedicada à gestão financeira e de ativos.",
      "Criámos uma identidade institucional sóbria, em preto e dourado, com um símbolo de laços entrelaçados, e o website do grupo — sob a assinatura “Forjado para resistir. Feito para crescer.”",
    ],
    services: ["Identidade institucional", "Logótipo", "Website"],
    cover: {
      src: wedatDark,
      alt: "Logótipo Group WEDAT sobre fundo preto",
      fit: "contain",
      position: "50% 38%",
      background: "#0b0b0b",
    },
    gallery: [
      { src: wedatDark, alt: "Logótipo Group WEDAT — versão para fundo escuro" },
      { src: wedatLight, alt: "Logótipo Group WEDAT — versão principal" },
      { src: wedatIcon, alt: "Símbolo Group WEDAT" },
    ],
  },
];

/** Marcas com quem a YAW trabalha, com as respetivas ligações. */
export type Client = {
  name: string;
  note?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
};

export const clients: Client[] = [
  { name: "Banco YETU", website: "https://www.bancoyetu.ao/" },
  { name: "iTec", website: "https://itec.co.ao/", instagram: "https://www.instagram.com/itec.ao/" },
  { name: "AMAC", website: "https://amacempresa.com/", instagram: "https://www.instagram.com/amacempresa/" },
  {
    name: "InterMarket",
    website: "https://intermarket.co.ao/",
    instagram: "https://www.instagram.com/intermarket.ao/",
  },
  { name: "iSoft", website: "https://isoft.ao/", instagram: "https://www.instagram.com/isoft.ao/" },
  { name: "ORA Invest", website: "https://www.orainvest.com/" },
  { name: "Sicomex", facebook: "https://www.facebook.com/grupo.sicomex" },
  {
    name: "Hotéis Chik Chik",
    website: "https://chikchikhoteis.com/",
    instagram: "https://www.instagram.com/chikchikhoteisangola/",
  },
  { name: "Rosas & Pétalas" },
  { name: "Fundação WEDAT", note: "Walcyr Emanuel de Almeida Tunguno" },
];
