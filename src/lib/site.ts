/**
 * Configuração global do site: identidade, contactos, redes e navegação.
 */
export const siteConfig = {
  name: "YAW Media Agency",
  shortName: "YAW Media",
  // No Netlify, a variável URL tem o endereço principal do site (o domínio próprio, quando existir)
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "https://yaw-media-agency.netlify.app",
  title: "YAW Media Agency — Marketing Digital, Branding e Performance",
  description:
    "A YAW Media Agency transforma estratégia em comunicação com impacto. Estratégia digital, branding, produção de conteúdo, social media e desenvolvimento web em Luanda, Angola.",
  keywords: [
    "agência de marketing digital",
    "agência de marketing Luanda",
    "branding",
    "identidade visual",
    "gestão de redes sociais",
    "social media",
    "gestão de campanhas",
    "publicidade digital",
    "desenvolvimento web",
    "design gráfico",
    "produção de conteúdo",
    "Luanda",
    "Angola",
  ],
  locale: "pt_PT",
  location: {
    street: "Av. Pedro de Castro Van-Dúnem Loy",
    city: "Luanda",
    country: "Angola",
    countryCode: "AO",
  },
  contact: {
    email: "yaw.media.agency@gmail.com",
    phone: "+244 951 326 931",
    phoneHref: "tel:+244951326931",
    responseTime: "Até 24 horas",
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/yaw_media_agency/" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61555898349790" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/yaw-media-agency/" },
  ],
  /** Empresa parceira — atendimento digital e automação com IA */
  partner: {
    name: "ChatUs",
    email: "chatus.angola@gmail.com",
    instagram: "https://www.instagram.com/chatus.ao/",
    instagramHandle: "@chatus.ao",
  },
  nav: [
    { label: "Serviços", href: "#servicos", id: "servicos" },
    { label: "Portefólio", href: "#portefolio", id: "portefolio" },
    { label: "Sobre", href: "#sobre", id: "sobre" },
    { label: "Contacto", href: "#contacto", id: "contacto" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
