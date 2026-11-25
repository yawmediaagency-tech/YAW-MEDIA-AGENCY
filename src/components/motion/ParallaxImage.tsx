"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/** Imagem que desliza ligeiramente dentro da moldura com o scroll (parallax subtil). */
export function ParallaxImage({
  src,
  alt,
  sizes,
  position = "50% 50%",
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={reduce ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          fill
          placeholder="blur"
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </motion.div>
    </div>
  );
}
