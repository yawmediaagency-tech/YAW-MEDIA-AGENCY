import { aboutPillars, aboutStatement, aboutStats, aboutStory, processSteps } from "@/content/about";
import { Counter } from "@/components/motion/Counter";
import { DrawLine } from "@/components/motion/DrawLine";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollRevealText } from "@/components/motion/ScrollRevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridLines } from "@/components/ui/GridLines";
import { Slash } from "@/components/ui/Slash";

export function About() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="relative overflow-hidden bg-paper py-24 text-ink sm:py-32 lg:py-40"
    >
      <GridLines tone="light" />

      <div className="relative container-x">
        {/* Manifesto */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Eyebrow index="03" tone="light">
              Sobre nós
            </Eyebrow>
            <h2 id="sobre-title" className="sr-only">
              Sobre a YAW Media Agency
            </h2>
          </div>
          <div className="lg:col-span-9">
            <ScrollRevealText
              text={aboutStatement}
              highlight={["impacto.", "parceiro"]}
              highlightClassName="text-brand-600"
              className="text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.14] font-semibold tracking-[-0.035em]"
            />
          </div>
        </div>

        {/* História + pilares */}
        <div className="mt-24 grid gap-14 lg:mt-32 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5 lg:pr-10">
            <h3 className="text-2xl font-bold tracking-[-0.03em]">Quem somos</h3>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-stone">
              {aboutStory.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <ol className="lg:col-span-7">
            {aboutPillars.map((pillar, i) => (
              <li key={pillar.title}>
                <Reveal delay={i * 0.08}>
                  <div className="group grid grid-cols-[3rem_1fr] gap-4 border-t border-paper-line py-8 sm:grid-cols-[4rem_1fr_1.2fr] sm:gap-6">
                    <span className="font-mono text-xs tracking-[0.14em] text-brand-700">0{i + 1}</span>
                    <h4 className="flex items-start gap-3 text-xl font-bold tracking-tight">
                      <Slash className="mt-1.5 h-3.5 w-0 opacity-0 transition-all duration-500 ease-out-expo group-hover:w-2.5 group-hover:opacity-100" />
                      {pillar.title}
                    </h4>
                    <p className="col-start-2 leading-relaxed text-stone sm:col-start-3">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {/* Números */}
        <dl className="mt-24 grid grid-cols-2 border-y border-paper-line lg:mt-32 lg:grid-cols-4">
          {aboutStats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.06}
              className="flex flex-col-reverse border-paper-line px-1 py-10 odd:border-r sm:px-6 lg:border-r lg:py-14 lg:last:border-r-0 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0"
            >
              <dt className="mt-3 eyebrow text-stone">{stat.label}</dt>
              <dd className="text-[clamp(2.75rem,6vw,5rem)] leading-none font-bold tracking-[-0.05em]">
                {stat.prefix && <span className="text-brand-600">{stat.prefix}</span>}
                <Counter value={stat.value} />
                {stat.suffix && <span className="text-brand-600">{stat.suffix}</span>}
              </dd>
            </Reveal>
          ))}
        </dl>

        {/* Processo */}
        <div className="mt-24 lg:mt-32">
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.035em]">
              Como trabalhamos
            </h3>
            <p className="max-w-sm leading-relaxed text-stone">
              Um processo claro, com marcos definidos e relatórios em cada etapa.
            </p>
          </Reveal>

          <div className="relative mt-12">
            {/* Linha que se desenha ao entrar no ecrã */}
            <div aria-hidden className="absolute inset-x-0 top-[7px] hidden lg:block">
              <DrawLine className="bg-linear-to-r from-brand-500 via-ink/20 to-ink/10" />
            </div>
            <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {processSteps.map((step, i) => (
                <li key={step.title} className="relative">
                  <Reveal delay={0.1 + i * 0.12}>
                    <span className="relative z-10 block size-[15px] rounded-full border-[3px] border-paper bg-brand-500 ring-1 ring-brand-500/40" />
                    <p className="mt-6 font-mono text-xs tracking-[0.14em] text-stone">ETAPA 0{i + 1}</p>
                    <h4 className="mt-2 text-xl font-bold tracking-tight">{step.title}</h4>
                    <p className="mt-2 leading-relaxed text-stone">{step.description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
