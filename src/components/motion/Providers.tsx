"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Respeita a preferência do sistema "reduzir movimento": as animações de
 * transformação são desativadas automaticamente para quem a tiver ativa.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
