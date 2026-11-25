import { cacheLife } from "next/cache";
import HalftoneWordmarkFooter, { type FooterColumn } from "@/components/ui/halftone-wordmark-footer";
import { services } from "@/content/services";
import { jakarta, jetbrains } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";

/** Ano corrente, calculado no build e revalidado diariamente (compatível com Cache Components). */
async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const { contact, location, socials } = siteConfig;

const columns: FooterColumn[] = [
  {
    title: "Navegação",
    links: [
      ...siteConfig.nav.map((n) => ({ label: n.label, href: n.href })),
      { label: "Fundador", href: "#fundador" },
      { label: "Parceiro ChatUs", href: "#chatus" },
    ],
  },
  {
    title: "Serviços",
    links: services.map((s) => ({ label: s.label, href: "#servicos" })),
  },
  {
    title: "Contacto",
    links: [
      { label: contact.email, href: `mailto:${contact.email}` },
      { label: contact.phone, href: contact.phoneHref },
      { label: location.street },
      ...socials.map((s) => ({ label: s.label, href: s.href })),
    ],
  },
];

/**
 * Rodapé com a marca em retícula interativa (componente em
 * src/components/ui/halftone-wordmark-footer.tsx), nas cores da YAW.
 */
export async function Footer() {
  const year = await getYear();
  return (
    <HalftoneWordmarkFooter
      wordmark="yaw media"
      label={siteConfig.name}
      meta={`© ${year} · ${location.city}, ${location.country} · Todos os direitos reservados`}
      columns={columns}
      backToTopLabel="Voltar ao topo ↑"
      palette={{ background: "#0b0b0b", ink: "#eceeec", warm: "#1ecc99" }}
      fontFamily={jakarta.style.fontFamily}
      monoFamily={jetbrains.style.fontFamily}
      // Altura ajustada à largura: a palavra fica logo abaixo do filete, sem espaço morto
      height="var(--hwf-h)"
      className="border-t border-white/[0.07] [--hwf-h:max(510px,calc(617px_-_18.75vw))] min-[721px]:[--hwf-h:calc(285px_+_11.75vw)]"
    />
  );
}
