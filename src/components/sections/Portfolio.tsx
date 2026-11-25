"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { clients, projectCategories, projects, type Project, type ProjectCategory } from "@/content/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectDialog } from "@/components/portfolio/ProjectDialog";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";
import { cn } from "@/lib/utils";

type Filter = ProjectCategory | "todos";

const categoryLabel = Object.fromEntries(projectCategories.map((c) => [c.id, c.label])) as Record<
  Filter,
  string
>;

/** Larguras (em 12 colunas) conforme o número de projetos visíveis — sem buracos na grelha. */
function getSpans(n: number): number[] {
  if (n === 1) return [12];
  if (n === 2) return [6, 6];
  if (n === 3) return [4, 4, 4];
  if (n === 4) return [12, 4, 4, 4];
  const rows = [
    [7, 5],
    [5, 7],
    [4, 4, 4],
  ];
  const spans: number[] = [];
  for (let r = 0; spans.length < n; r++) {
    const row = rows[r % rows.length];
    const left = n - spans.length;
    spans.push(...(left < row.length ? (left === 1 ? [12] : [6, 6]).slice(0, left) : row));
  }
  return spans;
}

const spanClass: Record<number, string> = {
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  12: "lg:col-span-12",
};

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [open, setOpen] = useState<Project | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const visible = useMemo(
    () => (filter === "todos" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  );
  const spans = getSpans(visible.length);

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: projects.length };
    for (const p of projects) for (const cat of p.categories) c[cat] = (c[cat] ?? 0) + 1;
    return c;
  }, []);

  const openProject = (p: Project, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setOpen(p);
  };
  const closeProject = () => {
    setOpen(null);
    lastTrigger.current?.focus();
  };

  return (
    <section
      id="portefolio"
      aria-labelledby="portefolio-title"
      className="relative overflow-hidden bg-ink pb-24 sm:pb-32 lg:pb-40"
    >
      {/* Faixa de capacidades */}
      <div className="border-b border-white/[0.07] py-8 text-[clamp(2.25rem,5vw,4.5rem)] font-bold tracking-[-0.04em] text-white/90 sm:py-10">
        <Marquee
          items={[
            "Branding",
            "Campanhas",
            "Social Media",
            "Websites",
            "Conteúdo",
            "Performance",
            "Motion",
            "SEO",
          ]}
        />
      </div>

      <div className="relative container-x pt-24 sm:pt-32">
        {/* Cabeçalho + filtros */}
        <div className="flex flex-col gap-10">
          <Reveal className="max-w-2xl">
            <Eyebrow index="02">Portefólio</Eyebrow>
            <h2
              id="portefolio-title"
              className="mt-6 text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.045em]"
            >
              Marcas que criámos. <span className="text-white/40">Campanhas que ficam.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
              Identidades, websites e campanhas — alguns dos projetos de que mais nos orgulhamos.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              role="group"
              aria-label="Filtrar projetos por categoria"
              className="flex max-w-full flex-wrap gap-1 rounded-2xl p-1 glass sm:-mx-1 sm:[scrollbar-width:none] sm:flex-nowrap sm:overflow-x-auto sm:rounded-full"
            >
              <LayoutGroup id="filtros">
                {projectCategories.map((cat) => {
                  const selected = filter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFilter(cat.id)}
                      aria-pressed={selected}
                      className={cn(
                        "relative shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                        selected ? "text-ink" : "text-white/70 hover:text-white",
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="filtro-ativo"
                          className="absolute inset-0 rounded-full bg-brand-500"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative">
                        {cat.label}
                        <sup
                          className={cn(
                            "ml-1 font-mono text-[10px]",
                            selected ? "text-ink/60" : "text-white/40",
                          )}
                        >
                          {counts[cat.id] ?? 0}
                        </sup>
                      </span>
                    </button>
                  );
                })}
              </LayoutGroup>
            </div>
          </Reveal>
        </div>

        {/* Grelha de projetos */}
        <motion.ul
          layout
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-5"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => (
              <motion.li
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={cn(spanClass[spans[i]], spans[i] >= 12 && "md:col-span-2")}
              >
                <ProjectCard
                  project={project}
                  featured={spans[i] >= 12}
                  priority={i === 0}
                  onOpen={(el) => openProject(project, el)}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Marcas com quem trabalhamos */}
        <div className="mt-24 lg:mt-32">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.035em]">
              Marcas com quem trabalhamos
            </h3>
            <p className="max-w-sm leading-relaxed text-white/60">
              Empresas e instituições que confiam na YAW para comunicar.
            </p>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 border-t border-l border-white/10 lg:grid-cols-5">
            {clients.map((c, i) => {
              const links = [
                c.website && { label: "Website", href: c.website },
                c.instagram && { label: "Instagram", href: c.instagram },
                c.facebook && { label: "Facebook", href: c.facebook },
              ].filter(Boolean) as { label: string; href: string }[];
              return (
                <li key={c.name} className="border-r border-b border-white/10">
                  <Reveal delay={(i % 5) * 0.04} className="h-full">
                    <div className="group flex h-full min-h-[132px] flex-col justify-between gap-5 px-4 py-6 transition-colors duration-500 hover:bg-white/[0.03] sm:px-6 sm:py-7 lg:min-h-[168px]">
                      <div>
                        <span className="flex items-center text-[clamp(1.05rem,1.7vw,1.5rem)] leading-tight font-bold tracking-[-0.03em] text-white/60 transition-colors duration-500 group-hover:text-white">
                          <span
                            aria-hidden
                            className="h-[0.7em] w-0 shrink-0 -skew-x-[12deg] bg-brand-500 opacity-0 transition-all duration-500 ease-out-expo group-hover:mr-2.5 group-hover:w-[0.4em] group-hover:opacity-100"
                          />
                          {c.name}
                        </span>
                        {c.note && (
                          <span className="mt-1.5 block text-[11px] leading-snug text-white/35">
                            {c.note}
                          </span>
                        )}
                      </div>
                      {links.length > 0 && (
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5" aria-label={`Ligações de ${c.name}`}>
                          {links.map((l) => (
                            <li key={l.href}>
                              <a
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${c.name} — ${l.label}`}
                                className="inline-flex items-center gap-0.5 font-mono text-[10px] tracking-[0.12em] text-white/45 uppercase transition-colors hover:text-brand-400"
                              >
                                {l.label}
                                <ArrowUpRight aria-hidden className="size-3" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center">
          <p className="max-w-md text-lg text-white/70">
            Tem um desafio semelhante? Vamos desenhar a solução certa para a sua marca.
          </p>
          <Button href="#contacto" variant="glass">
            Falar com a Equipa
          </Button>
        </Reveal>
      </div>

      <ProjectDialog project={open} onClose={closeProject} />
    </section>
  );
}

function ProjectCard({
  project,
  featured,
  priority,
  onOpen,
}: {
  project: Project;
  featured?: boolean;
  priority?: boolean;
  onOpen: (trigger: HTMLElement) => void;
}) {
  return (
    <article
      className={cn(
        "group relative isolate block aspect-[4/5] overflow-hidden rounded-2xl bg-ink-raised sm:aspect-[4/3] lg:aspect-auto",
        featured ? "lg:h-[540px]" : "lg:h-[460px]",
      )}
    >
      {/* Capa */}
      <div
        className="absolute inset-0 -z-10 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04] group-has-[:focus-visible]:scale-[1.04]"
        style={{ background: project.cover.background }}
      >
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          placeholder="blur"
          sizes={
            featured
              ? "(min-width: 1024px) 1280px, 100vw"
              : "(min-width: 1024px) 440px, (min-width: 768px) 50vw, 100vw"
          }
          className={project.cover.fit === "contain" ? "object-contain" : "object-cover"}
          style={{ objectPosition: project.cover.position ?? "50% 50%" }}
          priority={priority}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0.25)_0%,transparent_30%,transparent_55%,rgb(0_0_0/0.45))]"
      />

      {/* Etiquetas (em telemóveis passam para o painel, para não tapar a imagem) */}
      <div className="absolute inset-x-4 top-4 hidden items-start justify-between gap-2 sm:inset-x-6 sm:top-6 sm:flex">
        {project.badge ? (
          <span className="rounded-full bg-brand-500 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-ink uppercase">
            {project.badge}
          </span>
        ) : (
          <span />
        )}
        <span className="flex flex-wrap justify-end gap-1.5">
          {project.categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/10 bg-ink/55 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white uppercase backdrop-blur-md"
            >
              {categoryLabel[c]}
            </span>
          ))}
        </span>
      </div>

      {/* Painel de detalhes */}
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <div
          className={cn(
            "rounded-xl border border-white/10 bg-ink/65 p-5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl backdrop-saturate-150 transition-[background-color] duration-500 group-hover:bg-ink/80 sm:p-6",
            featured && "lg:max-w-xl",
          )}
        >
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              {project.badge && (
                <p className="mb-2.5 inline-block rounded-full bg-brand-500 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] text-ink uppercase sm:hidden">
                  {project.badge}
                </p>
              )}
              <p className="truncate eyebrow text-white/60">{project.client}</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-white/40 uppercase sm:hidden">
                {project.categories.map((c) => categoryLabel[c]).join(" · ")}
              </p>
              <h3 className="mt-1.5 text-lg leading-snug font-bold tracking-tight sm:text-xl">
                {project.title}
              </h3>
            </div>
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition-all duration-500 ease-out-expo group-hover:rotate-90 group-hover:bg-brand-500"
            >
              <Plus className="size-4" />
            </span>
          </div>

          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-700 ease-out-expo group-hover:grid-rows-[1fr] group-hover:opacity-100 group-has-[:focus-visible]:grid-rows-[1fr] group-has-[:focus-visible]:opacity-100">
            <div className="overflow-hidden">
              <p className="pt-4 text-sm leading-relaxed text-white/75">{project.summary}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 border-t border-white/10 pt-4 text-sm font-semibold text-brand-400">
                Ver projeto
                <ArrowUpRight aria-hidden className="size-4" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* O cartão inteiro abre o projeto */}
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        aria-label={`Ver projeto: ${project.client} — ${project.title}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-2xl outline-offset-4"
      />
    </article>
  );
}
