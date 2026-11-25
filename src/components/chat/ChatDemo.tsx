"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Conversa ilustrativa (em loop) do assistente Powered by ChatUs. */
const script: { role: "user" | "bot"; text: string }[] = [
  { role: "user", text: "Olá! Fazem gestão de redes sociais?" },
  {
    role: "bot",
    text: "Olá! Sim — gerimos redes sociais com calendário editorial, conteúdos e relatórios mensais. Quer pedir uma proposta?",
  },
  { role: "user", text: "Quero, sim." },
  { role: "bot", text: "Perfeito! Para começar, como se chama?" },
];

// Linha do tempo: [mensagens visíveis, a escrever?]
const frames: [number, boolean][] = [
  [0, false],
  [1, false],
  [1, true],
  [2, false],
  [3, false],
  [3, true],
  [4, false],
];
const DURATIONS = [700, 1100, 1500, 1700, 900, 1200, 4200];

export function ChatDemo({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  const reduce = usePrefersReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setTimeout(() => setFrame((f) => (f + 1) % frames.length), DURATIONS[frame]);
    return () => window.clearTimeout(t);
  }, [frame, inView, reduce]);

  const [count, typing] = reduce ? [script.length, false] : frames[frame];

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "flex h-[420px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink/80 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
        <span className="grid size-9 place-items-center rounded-full bg-brand-500">
          <svg viewBox="0 0 270 385" className="h-3.5 w-auto fill-ink">
            <polygon points="70,0 270,0 186,385 0,385" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold">Assistente YAW</p>
          <p className="text-[11px] text-white/50">Online · Powered by ChatUs</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-2.5 p-5">
        <AnimatePresence initial={false}>
          {script.slice(0, count).map((m, i) => (
            <motion.p
              key={`${i}-${m.text}`}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
                m.role === "user"
                  ? "self-end rounded-br-md bg-brand-500 text-ink"
                  : "self-start rounded-bl-md border border-white/[0.06] bg-white/[0.07] text-white/90",
              )}
            >
              {m.text}
            </motion.p>
          ))}
          {typing && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-fit items-center gap-1 self-start rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.07] px-4 py-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-1.5 rounded-full bg-white/60"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 border-t border-white/[0.08] p-3">
        <span className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] text-white/35">
          Escreva a sua mensagem…
        </span>
        <span className="grid size-10 place-items-center rounded-full bg-brand-500 text-ink">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
