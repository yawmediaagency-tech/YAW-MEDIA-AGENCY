"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Linha horizontal que se "desenha" da esquerda para a direita ao entrar no ecrã. */
export function DrawLine({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
      className={cn("h-px origin-left", className)}
    />
  );
}
