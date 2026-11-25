import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Founder } from "@/components/sections/Founder";
import { Hero } from "@/components/sections/Hero";
import { NextStep } from "@/components/sections/NextStep";
import { Partner } from "@/components/sections/Partner";
import { Portfolio } from "@/components/sections/Portfolio";
import { Services } from "@/components/sections/Services";

/**
 * Página principal (single-page): cada secção é um componente independente
 * em src/components/sections — reordene ou reutilize à vontade.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Founder />
      <NextStep />
      <Partner />
      <Contact />
    </>
  );
}
