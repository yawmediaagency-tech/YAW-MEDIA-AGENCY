import { Button } from "@/components/ui/Button";
import { Slash } from "@/components/ui/Slash";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center bg-ink pt-[72px]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_100%,rgb(30_204_153/0.2),transparent_70%)]"
      />
      <div className="relative container-x">
        <p className="eyebrow text-mist">Erro 404</p>
        <h1 className="mt-6 text-[clamp(2.5rem,7vw,6rem)] leading-none font-bold tracking-[-0.05em]">
          Página não encontrada
          <Slash className="ml-2 h-[0.6em]" />
        </h1>
        <p className="mt-6 max-w-md text-lg text-white/70">
          O conteúdo que procura mudou de sítio ou já não existe.
        </p>
        <Button href="/" size="lg" className="mt-10">
          Voltar ao início
        </Button>
      </div>
    </section>
  );
}
