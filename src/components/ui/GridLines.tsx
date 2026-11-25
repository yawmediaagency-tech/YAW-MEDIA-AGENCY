import { cn } from "@/lib/utils";

/**
 * Grelha arquitetónica decorativa: linhas finas verticais nas margens do
 * contentor (e opcionalmente ao centro), com marcas de canto "+".
 */
export function GridLines({
  tone = "dark",
  center = false,
  className,
}: {
  tone?: "dark" | "light";
  center?: boolean;
  className?: string;
}) {
  const line = tone === "dark" ? "border-white/[0.07]" : "border-ink/[0.08]";
  const mark = tone === "dark" ? "text-white/25" : "text-ink/25";

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="relative container-x h-full">
        <div className={cn("relative h-full border-x", line)}>
          {center && <div className={cn("absolute inset-y-0 left-1/2 hidden border-l lg:block", line)} />}
          {/* Marcas de canto */}
          <span className={cn("absolute top-0 -left-[5px] font-mono text-[10px] leading-none", mark)}>+</span>
          <span className={cn("absolute top-0 -right-[5px] font-mono text-[10px] leading-none", mark)}>
            +
          </span>
        </div>
      </div>
    </div>
  );
}

/** Pequenos cantos "[ ]" à volta de um elemento (ex.: logótipo na navbar). */
export function Brackets({ className }: { className?: string }) {
  const c = "absolute size-2 border-current";
  return (
    <span aria-hidden className={cn("pointer-events-none absolute -inset-2 text-white/30", className)}>
      <span className={cn(c, "top-0 left-0 border-t border-l")} />
      <span className={cn(c, "top-0 right-0 border-t border-r")} />
      <span className={cn(c, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(c, "right-0 bottom-0 border-r border-b")} />
    </span>
  );
}
