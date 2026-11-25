import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const panels = [
  {
    index: "01",
    tag: "Portefólio",
    title: "Veja o que já criámos",
    text: "Branding, campanhas, social media e web para marcas que quiseram ir mais longe.",
    cta: "Ver portefólio",
    href: "#portefolio",
  },
  {
    index: "02",
    tag: "Proposta",
    title: "Vamos falar do seu projeto",
    text: `Conte-nos o seu desafio e preparamos uma proposta à medida. Respondemos, em média, em 24 horas.`,
    cta: "Pedir proposta",
    href: "#contacto",
  },
];

/** Secção de próximo passo: dois grandes painéis — ver o portefólio ou pedir proposta. */
export function NextStep() {
  return (
    <section
      id="proposta"
      aria-labelledby="proposta-title"
      className="relative overflow-hidden bg-brand-500 text-ink"
    >
      <div aria-hidden className="h-8 hatch text-ink/[0.12]" />

      <div className="container-x pt-16 pb-12 sm:pt-20 lg:pt-24 lg:pb-16">
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2.5 eyebrow text-ink/70">
              <svg viewBox="0 0 270 385" aria-hidden className="h-2.5 w-auto fill-ink">
                <polygon points="70,0 270,0 186,385 0,385" />
              </svg>
              Próximo passo
            </p>
            <h2
              id="proposta-title"
              className="mt-6 max-w-[16ch] text-[clamp(2.4rem,5.6vw,5rem)] leading-[1] font-bold tracking-[-0.04em]"
            >
              Pronto para elevar a sua marca?
            </h2>
          </div>
          <p className="max-w-sm text-lg leading-relaxed text-ink/75">
            Explore o nosso trabalho ou fale já connosco. Cada grande projeto começa com uma boa conversa.
          </p>
        </Reveal>
      </div>

      <div className="grid border-t border-ink/15 lg:grid-cols-2">
        {panels.map((p, i) => (
          <a
            key={p.href}
            href={p.href}
            className="group relative isolate flex min-h-[340px] flex-col justify-between overflow-hidden border-ink/15 p-8 transition-colors duration-500 not-last:border-b hover:text-white sm:p-12 lg:min-h-[440px] lg:p-16 lg:not-last:border-r lg:not-last:border-b-0"
          >
            {/* Varrimento preto no hover */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-out-expo group-hover:scale-y-100"
            />
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_100%_100%,rgb(30_204_153/0.28),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />

            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.14em] uppercase">
                {p.index} — {p.tag}
              </span>
              <span className="font-mono text-xs tracking-[0.14em] uppercase opacity-60">
                {i === 0 ? "Explorar" : "Começar"}
              </span>
            </div>

            <div className="mt-16">
              <h3 className="max-w-[14ch] text-[clamp(2rem,4vw,3.5rem)] leading-[1.02] font-bold tracking-[-0.045em]">
                {p.title}
              </h3>
              <p className="mt-5 max-w-md leading-relaxed opacity-75">{p.text}</p>

              <span className="mt-10 inline-flex items-center gap-4 text-lg font-semibold">
                <span className="relative grid size-14 place-items-center overflow-hidden rounded-full bg-ink text-brand-500 transition-colors duration-500 group-hover:bg-brand-500 group-hover:text-ink">
                  <ArrowUpRight
                    aria-hidden
                    className="size-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-10 group-hover:-translate-y-10"
                  />
                  <ArrowUpRight
                    aria-hidden
                    className="absolute size-6 -translate-x-10 translate-y-10 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0"
                  />
                </span>
                {p.cta}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
