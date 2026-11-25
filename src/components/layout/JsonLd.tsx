import { founder } from "@/content/founder";
import { services } from "@/content/services";
import { siteConfig } from "@/lib/site";

/** Dados estruturados (schema.org) para motores de pesquisa. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    image: `${siteConfig.url}/opengraph-image`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.street,
      addressLocality: siteConfig.location.city,
      addressCountry: siteConfig.location.countryCode,
    },
    areaServed: siteConfig.location.country,
    founder: { "@type": "Person", name: founder.name, jobTitle: founder.role },
    sameAs: siteConfig.socials.map((s) => s.href),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.description },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // O JSON é gerado a partir de dados estáticos do próprio projeto
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
