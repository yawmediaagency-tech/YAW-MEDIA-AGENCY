import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollRevealText } from "@/components/motion/ScrollRevealText";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridLines } from "@/components/ui/GridLines";
import { ServiceIcon } from "@/components/visuals/ServiceIcon";

export function Services() {
  return (
    <section
      id="servicos"
      aria-labelledby="servicos-title"
      className="relative overflow-hidden bg-paper py-24 text-ink sm:py-32 lg:py-40"
    >
      <GridLines tone="light" />

      <div className="relative container-x">
        {/* Cabeçalho */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Eyebrow index="01" tone="light">
              Serviços
            </Eyebrow>
          </div>
          <div className="lg:col-span-9">
            <ScrollRevealText
              as="h2"
              id="servicos-title"
              text="Da estratégia ao pixel: tudo o que a sua marca precisa para crescer no digital, num só parceiro."
              highlight={["pixel:"]}
              highlightClassName="text-brand-600"
              className="text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.06] font-bold tracking-[-0.04em]"
            />
            <Reveal className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md leading-relaxed text-stone">
                Quatro áreas que trabalham em conjunto — para que a sua marca diga a coisa certa, no sítio
                certo, com o impacto certo.
              </p>
              <Button href="#contacto" variant="ink" className="self-start sm:self-auto">
                Pedir proposta
              </Button>
            </Reveal>
          </div>
        </div>

        {/* Grelha de serviços */}
        <ul className="mt-20 grid border-t border-l border-paper-line sm:grid-cols-2 lg:mt-28">
          {services.map((service, i) => (
            <li key={service.id} className="border-r border-b border-paper-line">
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <article className="group relative isolate flex h-full flex-col overflow-hidden p-7 sm:p-10 lg:p-12">
                  {/* Varrimento escuro no hover */}
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-out-expo group-hover:scale-y-100"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(70%_90%_at_80%_110%,rgb(30_204_153/0.25),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />

                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tracking-[0.14em] text-stone transition-colors duration-500 group-hover:text-brand-400">
                      0{i + 1}
                    </span>
                    <ServiceIcon
                      id={service.id}
                      className="text-ink transition-colors duration-500 group-hover:text-white"
                    />
                  </div>

                  <h3 className="mt-14 max-w-sm text-2xl leading-tight font-bold tracking-[-0.03em] transition-colors duration-500 group-hover:text-white sm:text-[1.75rem]">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-md leading-relaxed text-stone transition-colors duration-500 group-hover:text-white/70">
                    {service.description}
                  </p>

                  <ul className="mt-8 flex flex-wrap gap-2" aria-label={`Inclui em ${service.label}`}>
                    {service.deliverables.map((d) => (
                      <li
                        key={d}
                        className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors duration-500 group-hover:border-white/15 group-hover:text-white/80"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contacto"
                    className="mt-auto inline-flex items-center gap-2 pt-10 text-sm font-semibold text-ink transition-colors duration-500 group-hover:text-brand-400"
                  >
                    Falar sobre {service.label.split(" ")[0].toLowerCase()}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
