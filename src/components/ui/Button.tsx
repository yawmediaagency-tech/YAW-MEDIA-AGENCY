import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "glass" | "ink" | "outline";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-semibold tracking-tight whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-(--ease-out-expo) active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Verde da marca — ação principal
  primary:
    "bg-brand-500 text-ink shadow-[0_0_0_1px_rgb(30_204_153/0.4),0_12px_40px_-12px_rgb(30_204_153/0.7)] hover:bg-brand-400 hover:shadow-[0_0_0_1px_rgb(30_204_153/0.6),0_18px_50px_-12px_rgb(30_204_153/0.9)]",
  // Vidro — ação secundária sobre fundo escuro
  glass: "glass text-white hover:border-white/25 hover:bg-white/10",
  // Preto — ação principal sobre fundo claro
  ink: "bg-ink text-white hover:bg-ink-raised",
  // Contorno — ação secundária sobre fundo claro
  outline: "border border-ink/15 text-ink hover:border-ink/40",
};

const sizes: Record<Size, string> = {
  md: "h-11 pl-5 pr-2 text-sm",
  lg: "h-14 pl-7 pr-2.5 text-[15px]",
};

const iconWrap: Record<Variant, string> = {
  primary: "bg-ink text-brand-500",
  glass: "bg-white text-ink",
  ink: "bg-brand-500 text-ink",
  outline: "bg-ink text-white",
};

/** Ícone de seta com animação "sai / entra" no hover. */
function ArrowSwap({ variant, size }: { variant: Variant; size: Size }) {
  const box = size === "lg" ? "size-9" : "size-7";
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full",
        box,
        iconWrap[variant],
      )}
    >
      <ArrowUpRight className="size-4 transition-transform duration-500 ease-(--ease-out-expo) group-hover/btn:translate-x-6 group-hover/btn:-translate-y-6" />
      <ArrowUpRight className="absolute size-4 -translate-x-6 translate-y-6 transition-transform duration-500 ease-(--ease-out-expo) group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
    </span>
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Mostra a seta animada (por defeito: sim) */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & ComponentPropsWithoutRef<"a"> & { href: string };
type ButtonAsButton = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", arrow = true, children, className, ...rest } = props;
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    !arrow && (size === "lg" ? "px-7" : "px-5"),
    className,
  );
  const content = (
    <>
      <span className="relative">{children}</span>
      {arrow && <ArrowSwap variant={variant} size={size} />}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as ComponentPropsWithoutRef<"a"> & { href: string };
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const buttonProps = rest as ComponentPropsWithoutRef<"button">;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
