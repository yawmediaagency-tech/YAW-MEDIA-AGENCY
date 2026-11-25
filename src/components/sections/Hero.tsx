import { Button } from "@/components/ui/Button";
import { GridLines } from "@/components/ui/GridLines";
import { Slash } from "@/components/ui/Slash";
import { HalftoneWordmark } from "@/components/visuals/HalftoneWordmark";
import { jakarta } from "@/lib/fonts";

/* O título é animado em CSS (palavra a palavra) para aparecer no primeiro
   frame, sem depender do JavaScript — melhor LCP. */
const lines = [
  { words: ["Elevamos", "a", "sua"], tone: "text-white" },
  { words: ["marca", "ao", "próximo"], tone: "text-white" },
  { words: ["nível", "digital"], tone: "text-white/40" },
];

export function Hero() {
  let wordIndex = 0;

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-[72px]"
    >
      {/* Palavra YAW em retícula, assente no fundo da secção (interativa) */}
      <HalftoneWordmark
        wordmark="yaw"
        crop={0.3}
        fontFamily={jakarta.style.fontFamily}
        className="absolute inset-0 -z-10"
      />
      {/* Brilho verde subtil + grão */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(55%_45%_at_85%_0%,rgb(30_204_153/0.16),transparent_70%),radial-gradient(40%_35%_at_0%_45%,rgb(30_204_153/0.06),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 grain opacity-[0.06] mix-blend-overlay"
      />
      <GridLines center />

      <div className="relative container-x flex flex-1 flex-col pb-[calc(19.5vw+1.25rem)]">
        {/* Mensagem principal */}
        <div className="flex flex-1 flex-col justify-center py-12 lg:py-16">
          <h1
            id="hero-title"
            className="max-w-[15ch] text-[clamp(2.6rem,min(6.2vw,10.5svh),5.4rem)] leading-[1.02] font-bold tracking-[-0.045em] sm:max-w-none"
          >
            {lines.map((line, li) => (
              <span key={li} className={`block ${line.tone}`}>
                {line.words.map((word, wi) => {
                  const delay = 180 + wordIndex++ * 70;
                  const isLast = li === lines.length - 1 && wi === line.words.length - 1;
                  return (
                    <span
                      key={word}
                      className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom not-last:mr-[0.1em]"
                    >
                      <span className="inline-block animate-rise" style={{ animationDelay: `${delay}ms` }}>
                        {word}
                        {isLast && (
                          <>
                            <span className="sr-only">.</span>
                            <Slash className="ml-[0.08em] h-[0.62em] align-baseline" />
                          </>
                        )}
                      </span>
                      {wi < line.words.length - 1 ? " " : ""}
                    </span>
                  );
                })}{" "}
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl animate-fade-up text-lg leading-relaxed text-white/70 [animation-delay:700ms] sm:text-xl">
              Transformamos estratégia em comunicação com impacto — juntando tecnologia, estética e execução
              para criar marcas memoráveis e campanhas que geram resultados.
            </p>

            <div className="flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:850ms]">
              <Button href="#portefolio" size="lg">
                Ver Portefólio
              </Button>
              <Button href="#contacto" size="lg" variant="glass">
                Pedir Proposta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
