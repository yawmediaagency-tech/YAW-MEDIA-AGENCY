import { cn } from "@/lib/utils";

/**
 * A "barra" do logótipo YAW — paralelogramo inclinado usado como
 * motivo gráfico (marcadores, pontuação, detalhes decorativos).
 */
export function Slash({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 270 385"
      aria-hidden
      className={cn("inline-block h-[0.7em] w-auto fill-brand-500", className)}
    >
      <polygon points="70,0 270,0 186,385 0,385" />
    </svg>
  );
}
