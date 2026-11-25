import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/lib/site";

const { contact, location, socials } = siteConfig;

const details = [
  { icon: Mail, label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
  { icon: Phone, label: "Telefone", value: contact.phone, href: contact.phoneHref },
  { icon: MapPin, label: "Morada", value: `${location.street}, ${location.city}` },
  { icon: Clock, label: "Resposta", value: contact.responseTime },
];

export function Contact() {
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32 lg:py-40"
    >
      {/* Brilho verde (espelha o hero) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_0%_100%,rgb(30_204_153/0.22),transparent_70%),radial-gradient(40%_40%_at_100%_0%,rgb(30_204_153/0.08),transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 grain opacity-[0.05] mix-blend-overlay" />

      <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Coluna de texto */}
        <div className="flex flex-col lg:col-span-5 lg:pr-8">
          <Reveal>
            <Eyebrow index="05">Contacto</Eyebrow>
            <h2
              id="contacto-title"
              className="mt-6 text-[clamp(2.25rem,4.8vw,4rem)] leading-[1.02] font-bold tracking-[-0.045em]"
            >
              Tem um projeto em mente? <span className="text-brand-400">Vamos falar.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Conte-nos onde quer levar a sua marca. Respondemos com uma proposta à medida — sem compromisso.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <dl className="divide-y divide-white/10 border-y border-white/10">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:gap-4">
                  <dt className="flex shrink-0 items-center gap-2.5 text-white/50 sm:w-28">
                    <Icon aria-hidden className="size-4 text-brand-400" strokeWidth={1.75} />
                    <span className="eyebrow">{label}</span>
                  </dt>
                  <dd className="min-w-0 font-medium break-words">
                    {href ? (
                      <a href={href} className="transition-colors hover:text-brand-400">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <p className="eyebrow text-white/50">Siga-nos</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition-colors duration-300 hover:border-brand-500/60 hover:text-white"
                  >
                    {s.label}
                    <ArrowUpRight
                      aria-hidden
                      className="size-3.5 text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-400"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="font-semibold tracking-tight">Prefere conversar?</p>
            <p className="mt-1 text-sm leading-relaxed text-white/60">
              O nosso assistente recolhe o seu pedido em menos de um minuto.
            </p>
            <OpenChatButton variant="glass" size="md" detail={{ lead: true }} className="mt-4">
              Pedir pelo chat
            </OpenChatButton>
          </Reveal>
        </div>

        {/* Formulário */}
        <Reveal delay={0.1} className="lg:col-span-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
