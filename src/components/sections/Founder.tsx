import { founder } from "@/content/founder";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Brackets, GridLines } from "@/components/ui/GridLines";
import { siteConfig } from "@/lib/site";

/** Fundador e Diretor-Geral da YAW. */
export function Founder() {
  return (
    <section
      id="fundador"
      aria-labelledby="fundador-title"
      className="relative isolate overflow-hidden bg-ink py-20 sm:py-28 lg:py-36"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_20%_40%,rgb(30_204_153/0.10),transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 grain opacity-[0.05] mix-blend-overlay" />
      <GridLines />

      <div className="relative container-x grid grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Retrato (preto e branco) */}
        <Reveal className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative">
            <Brackets className="-inset-3 text-white/25" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-ink-raised sm:rounded-[2rem]">
              <ParallaxImage
                src={founder.portrait}
                alt={`${founder.name}, ${founder.role} da ${siteConfig.name}`}
                sizes="(min-width: 1024px) 520px, (min-width: 640px) 448px, 100vw"
                position="50% 30%"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(11_11_11/0.55))]"
              />
            </div>
          </div>
        </Reveal>

        {/* Texto */}
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Fundador</Eyebrow>
            <h2
              id="fundador-title"
              className="mt-5 text-[clamp(2.1rem,5.4vw,4.75rem)] leading-[1.02] font-bold tracking-[-0.045em] sm:mt-6"
            >
              <span className="block">{founder.nameLines[0]}</span>
              <span className="block text-white/45">{founder.nameLines[1]}</span>
            </h2>
            <p className="mt-5 eyebrow text-brand-400 sm:mt-6">
              {founder.role} · {siteConfig.name}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 sm:mt-10 sm:text-xl lg:text-2xl lg:leading-[1.5]">
              {founder.bio}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
