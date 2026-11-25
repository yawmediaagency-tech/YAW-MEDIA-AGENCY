export type ServiceId = "estrategia" | "branding" | "conteudo" | "web";

export type Service = {
  id: ServiceId;
  /** Nome curto (usado em filtros, formulário e rodapé) */
  label: string;
  title: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    id: "estrategia",
    label: "Estratégia & Campanhas",
    title: "Estratégia de Marketing Digital e Gestão de Campanhas",
    description:
      "Planeamos, lançamos e otimizamos campanhas orientadas por dados em Meta, Google, TikTok e LinkedIn — com objetivos claros e relatórios que mostram o retorno de cada investimento.",
    deliverables: ["Plano de marketing", "Media paga", "Funis de conversão", "Relatórios & KPIs"],
  },
  {
    id: "branding",
    label: "Branding & Design",
    title: "Branding, Identidade Visual e Design Gráfico",
    description:
      "Construímos marcas com personalidade: da estratégia e do naming ao sistema visual completo, com manuais de normas prontos para escalar em todos os pontos de contacto.",
    deliverables: ["Estratégia de marca", "Identidade visual", "Manual de normas", "Editorial & packaging"],
  },
  {
    id: "conteudo",
    label: "Conteúdo & Social Media",
    title: "Produção de Conteúdo e Social Media",
    description:
      "Criamos conteúdo que faz parar o scroll — fotografia, vídeo, motion e copy — e gerimos comunidades com calendário editorial, consistência e um tom de voz próprio.",
    deliverables: ["Gestão de redes sociais", "Foto & vídeo", "Motion design", "Copywriting"],
  },
  {
    id: "web",
    label: "Web & Soluções Digitais",
    title: "Desenvolvimento Web e Soluções Digitais",
    description:
      "Desenhamos e desenvolvemos websites, landing pages e produtos digitais rápidos, acessíveis e otimizados para SEO e conversão — prontos para crescer com o seu negócio.",
    deliverables: ["Websites institucionais", "Landing pages", "E-commerce", "UX/UI design"],
  },
];
