"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Brackets } from "@/components/ui/GridLines";
import { Button } from "@/components/ui/Button";
import { Slash } from "@/components/ui/Slash";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Fundo de vidro após o topo + esconde ao descer / mostra ao subir
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 480);
  });

  // Destaca o link da secção visível (as secções fora do menu limpam o destaque)
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Menu móvel: bloqueia o scroll e fecha com Escape
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? -140 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || open
              ? "border-white/[0.08] bg-ink/80 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Navegação principal"
            className="container-x flex h-[72px] items-center justify-between gap-6"
          >
            <a
              href="#inicio"
              aria-label="YAW Media Agency — voltar ao início"
              className="group relative -m-1 p-1"
              onClick={() => setOpen(false)}
            >
              <Brackets className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Logo title={null} className="h-7 text-white sm:h-8" />
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {siteConfig.nav.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                        isActive ? "text-white" : "text-mist hover:text-white",
                      )}
                    >
                      <Slash
                        className={cn(
                          "h-2 transition-all duration-500 ease-out-expo",
                          isActive
                            ? "w-1.5 opacity-100"
                            : "-ml-2 w-0 opacity-0 group-hover:ml-0 group-hover:w-1.5 group-hover:opacity-60",
                        )}
                      />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <Button href="#contacto" size="md" className="hidden sm:inline-flex">
                Iniciar Projeto
              </Button>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-movel"
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                className="relative grid size-11 place-items-center rounded-full glass md:hidden"
              >
                <span
                  className={cn(
                    "absolute h-px w-5 bg-white transition-transform duration-500 ease-out-expo",
                    open ? "rotate-45" : "-translate-y-[4px]",
                  )}
                />
                <span
                  className={cn(
                    "absolute h-px w-5 bg-white transition-transform duration-500 ease-out-expo",
                    open ? "-rotate-45" : "translate-y-[4px]",
                  )}
                />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Menu móvel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[72px] md:hidden"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(80%_60%_at_20%_100%,rgb(30_204_153/0.28),transparent_70%)]"
            />
            <div className="relative container-x flex flex-1 flex-col justify-between pt-10 pb-10">
              <ul className="space-y-1">
                {siteConfig.nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease: EASE }}
                      className="flex items-baseline gap-4 py-2 text-[2.75rem] leading-none font-bold tracking-[-0.04em]"
                    >
                      <span className="font-mono text-xs font-normal tracking-normal text-brand-400">
                        0{i + 1}
                      </span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                className="space-y-8"
              >
                <Button
                  href="#contacto"
                  size="lg"
                  onClick={() => setOpen(false)}
                  className="w-full justify-between"
                >
                  Iniciar Projeto
                </Button>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {siteConfig.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="eyebrow text-mist hover:text-white"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="block text-lg font-medium text-white/80"
                >
                  {siteConfig.contact.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
