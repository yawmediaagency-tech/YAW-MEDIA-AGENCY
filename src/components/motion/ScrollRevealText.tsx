"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type ScrollRevealTextProps = {
  text: string;
  /** Palavras a destacar com a cor da marca */
  highlight?: string[];
  as?: "p" | "h2" | "h3";
  id?: string;
  className?: string;
  highlightClassName?: string;
  /** Opacidade das palavras ainda não reveladas */
  dim?: number;
};

const normalize = (w: string) => w.toLowerCase().replace(/[.,;:!?—–"“”]/g, "");

/**
 * Texto que "acende" palavra a palavra à medida que se faz scroll.
 * O texto completo existe no HTML (SEO e leitores de ecrã não são afetados).
 */
export function ScrollRevealText({
  text,
  highlight = [],
  as: Tag = "p",
  id,
  className,
  highlightClassName = "text-brand-500",
  dim = 0.16,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "start 0.3"],
  });

  const words = text.split(" ");
  const marks = new Set(highlight.map(normalize));

  return (
    <div ref={ref}>
      <Tag id={id} className={cn("text-balance", className)}>
        {words.map((word, i) => {
          const isMark = marks.has(normalize(word));
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <span key={`${word}-${i}`} className={cn(isMark && highlightClassName)}>
              {reduce ? (
                word
              ) : (
                <Word progress={scrollYProgress} range={[start, end]} dim={dim}>
                  {word}
                </Word>
              )}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  dim,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dim: number;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
