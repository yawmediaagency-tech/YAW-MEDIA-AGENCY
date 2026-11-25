import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slash } from "./Slash";

type EyebrowProps = {
  children: ReactNode;
  /** Número da secção, ex.: "01" */
  index?: string;
  tone?: "dark" | "light";
  className?: string;
};

/** Etiqueta de secção em mono, com a barra da marca como marcador. */
export function Eyebrow({ children, index, tone = "dark", className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 eyebrow",
        tone === "dark" ? "text-mist" : "text-stone",
        className,
      )}
    >
      <Slash className="h-2.5" />
      {index && <span className={tone === "dark" ? "text-brand-400" : "text-brand-700"}>{index}</span>}
      {index && (
        <span aria-hidden className="opacity-40">
          —
        </span>
      )}
      <span>{children}</span>
    </p>
  );
}
