import { Slash } from "./Slash";
import { cn } from "@/lib/utils";

/** Faixa de texto em loop infinito (CSS puro, pausa no hover). */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center">
          <span className={cn("px-6 sm:px-10", i % 2 === 1 && "text-outline")}>{item}</span>
          <Slash className="h-[0.55em]" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
