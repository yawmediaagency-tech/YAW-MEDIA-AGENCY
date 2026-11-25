import type { ServiceId } from "@/content/services";
import { cn } from "@/lib/utils";

/**
 * Ilustrações vetoriais dos serviços. As linhas "redesenham-se" quando o
 * cartão pai (classe `group`) recebe hover — animação só em CSS.
 * O paralelogramo verde é a barra da marca YAW.
 */
const SLASH = "M0 0h8l-3 14H-3z"; // mini barra (14px de altura)

const drawn = "[stroke-dasharray:1] [stroke-dashoffset:0] group-hover:animate-draw";

function Stroke({ d, delay = 0 }: { d: string; delay?: number }) {
  return <path d={d} pathLength={1} className={drawn} style={{ animationDelay: `${delay}ms` }} />;
}

const icons: Record<ServiceId, React.ReactNode> = {
  // Estratégia & campanhas — gráfico ascendente com alvo
  estrategia: (
    <>
      <Stroke d="M8 54h48M8 54V10" />
      <Stroke d="M14 44l10-9 8 6 16-19" delay={120} />
      <Stroke d="M48 13a9 9 0 1 1 0 18a9 9 0 1 1 0-18z" delay={240} />
      <path d={SLASH} transform="translate(46 15)" className="fill-brand-500 stroke-none" />
    </>
  ),
  // Branding — círculo + quadrado sobrepostos
  branding: (
    <>
      <Stroke d="M24 12a15 15 0 1 1 0 30a15 15 0 1 1 0-30z" />
      <Stroke d="M28 28h26v26H28z" delay={140} />
      <Stroke d="M8 58h18" delay={260} />
      <path d={SLASH} transform="translate(44 8)" className="fill-brand-500 stroke-none" />
    </>
  ),
  // Conteúdo & social — ecrã vertical com "play"
  conteudo: (
    <>
      <Stroke d="M20 8h24a3 3 0 0 1 3 3v42a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z" />
      <Stroke d="M28 24l12 8-12 8z" delay={140} />
      <Stroke d="M9 18v28M55 18v28" delay={240} />
      <path d={SLASH} transform="translate(30 44)" className="fill-brand-500 stroke-none" />
    </>
  ),
  // Web & digital — janela de browser com código
  web: (
    <>
      <Stroke d="M10 12h44a3 3 0 0 1 3 3v34a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" />
      <Stroke d="M7 22h50" delay={100} />
      <Stroke d="M26 30l-7 7 7 7M38 30l7 7-7 7" delay={200} />
      <path d={SLASH} transform="translate(12 14) scale(0.4)" className="fill-brand-500 stroke-none" />
      <path d={SLASH} transform="translate(30 30) scale(1)" className="fill-brand-500 stroke-none" />
    </>
  ),
};

export function ServiceIcon({ id, className }: { id: ServiceId; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-14", className)}
    >
      {icons[id]}
    </svg>
  );
}
