"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { projectCategories, type Project } from "@/content/projects";
import { Button } from "@/components/ui/Button";

const label = Object.fromEntries(projectCategories.map((c) => [c.id, c.label])) as Record<string, string>;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Janela com o detalhe de um projeto: texto, serviços, ligações e galeria. */
export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Mantém o foco dentro da janela
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/80 backdrop-blur-md sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="projeto-titulo"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92svh] w-full max-w-6xl overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-ink-soft text-white shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)] sm:rounded-3xl"
          >
            {/* Barra superior */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/[0.08] bg-ink-soft/90 px-5 py-3.5 backdrop-blur-xl sm:px-10 sm:py-4">
              <p className="eyebrow text-white/60">{project.client}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar projeto"
                className="grid size-10 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-10 p-5 sm:p-10 lg:grid-cols-12 lg:gap-12">
              {/* Texto */}
              <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
                <div className="flex flex-wrap gap-1.5">
                  {project.categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-white/70 uppercase"
                    >
                      {label[c]}
                    </span>
                  ))}
                </div>
                <h3
                  id="projeto-titulo"
                  className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.035em]"
                >
                  {project.title}
                </h3>
                <div className="mt-6 space-y-4 leading-relaxed text-white/70">
                  {project.description.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>

                <p className="mt-8 eyebrow text-white/40">O que fizemos</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/85"
                    >
                      {s}
                    </li>
                  ))}
                </ul>

                {project.links && project.links.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.links.map((l) => (
                      <Button key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Galeria */}
              <div className="columns-2 gap-2 sm:gap-3 lg:col-span-7 [&>*]:mb-2 sm:[&>*]:mb-3">
                {project.gallery.map((img, i) => (
                  <motion.div
                    key={`${img.alt}-${i}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: EASE }}
                    className="break-inside-avoid overflow-hidden rounded-xl bg-ink-raised"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      placeholder="blur"
                      sizes="(min-width: 1024px) 340px, 50vw"
                      className="h-auto w-full"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
