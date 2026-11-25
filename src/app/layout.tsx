import type { Metadata, Viewport } from "next";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/layout/JsonLd";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/motion/Providers";
import { jakarta, jetbrains } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-PT" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="fixed top-4 left-4 z-[100] -translate-y-24 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
        >
          Saltar para o conteúdo
        </a>
        <Providers>
          <Navbar />
          <main id="conteudo">{children}</main>
          <Footer />
          <ChatWidget />
        </Providers>
        <JsonLd />
      </body>
    </html>
  );
}
