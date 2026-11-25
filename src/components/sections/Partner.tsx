import Image from "next/image";
import { Bot, Handshake, Headset } from "lucide-react";
import chatusLogo from "@/assets/partners/chatus-logo-white.png";
import { ChatDemo } from "@/components/chat/ChatDemo";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridLines } from "@/components/ui/GridLines";
import { siteConfig } from "@/lib/site";

const { partner } = siteConfig;

const features = [
  { icon: Headset, title: "Atendimento ao cliente", text: "Respostas rápidas, cordiais e consistentes." },
  { icon: Handshake, title: "Suporte comercial", text: "Acompanhamento de contactos até à venda." },
  { icon: Bot, title: "Automação com IA", text: "Assistentes virtuais disponíveis a qualquer hora." },
];

/** Empresa parceira: ChatUs — atendimento digital e automação com IA. */
export function Partner() {
  return (
    <section
      id="chatus"
      aria-labelledby="chatus-title"
      className="relative overflow-hidden bg-paper-soft py-24 text-ink sm:py-32 lg:py-36"
    >
      <GridLines tone="light" />

      <div className="relative container-x">
        <Reveal className="flex items-center justify-between gap-6">
          <Eyebrow index="04" tone="light">
            Empresa parceira
          </Eyebrow>
          <p className="hidden eyebrow text-stone sm:block">YAW × {partner.name}</p>
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <div className="relative isolate grid grid-cols-1 overflow-hidden rounded-[1.5rem] bg-ink text-white sm:rounded-[2rem] lg:grid-cols-12">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_100%_100%,rgb(1_122_255/0.24),transparent_70%),radial-gradient(40%_50%_at_0%_0%,rgb(1_122_255/0.08),transparent_70%)]"
            />
            <div aria-hidden className="absolute inset-0 -z-10 grain opacity-[0.05] mix-blend-overlay" />

            {/* Texto */}
            <div className="p-8 sm:p-12 lg:col-span-7 lg:p-16">
              {/* Logótipo oficial da ChatUs (versão para fundo escuro) */}
              <Image src={chatusLogo} alt={partner.name} sizes="200px" className="h-16 w-auto sm:h-20" />

              <h2
                id="chatus-title"
                className="mt-10 max-w-[14ch] text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-bold tracking-[-0.045em]"
              >
                Atendimento que <span className="text-chatus-light">não dorme.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                A {partner.name} é um call center digital em Angola, especializado em atendimento ao cliente,
                suporte comercial e automação com inteligência artificial — e a empresa parceira que dá vida
                ao assistente deste site. Juntas, a YAW e a {partner.name} ligam o marketing que atrai ao
                atendimento que converte.
              </p>

              <ul className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
                {features.map(({ icon: Icon, title, text }) => (
                  <li key={title}>
                    <Icon aria-hidden className="size-5 text-chatus-light" strokeWidth={1.75} />
                    <p className="mt-3 font-semibold tracking-tight">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{text}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <OpenChatButton>Experimentar o assistente</OpenChatButton>
                <Button href={partner.instagram} variant="glass" size="lg">
                  Conhecer a {partner.name}
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/50">
                <a href={`mailto:${partner.email}`} className="hover:text-chatus-light">
                  {partner.email}
                </a>
                <span className="mx-2 opacity-40">·</span>
                <a
                  href={partner.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-chatus-light"
                >
                  {partner.instagramHandle}
                </a>
              </p>
            </div>

            {/* Demonstração do assistente */}
            <div className="relative flex items-center border-t border-white/10 p-6 sm:p-12 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-12">
              <ChatDemo className="w-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
