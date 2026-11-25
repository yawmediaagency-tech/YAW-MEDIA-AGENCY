"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const format = (v: number) => Math.round(v).toLocaleString("pt-PT");

/**
 * Número que conta de 0 até `value` quando entra no ecrã.
 * O valor final é renderizado no servidor (SEO / sem JS); no cliente é
 * reposto a 0 até o contador ficar visível.
 */
export function Counter({ value, duration = 1.8 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (!reduce && ref.current && !started.current) ref.current.textContent = "0";
  }, [reduce]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    started.current = true;
    if (reduce) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = format(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
    </span>
  );
}
