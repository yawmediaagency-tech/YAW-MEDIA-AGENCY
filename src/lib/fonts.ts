import localFont from "next/font/local";

/**
 * Fontes Google (licença OFL) servidas a partir do próprio projeto via next/font.
 * Vantagens: zero pedidos a servidores externos, sem layout shift e build
 * independente de rede. Ficheiros em src/fonts (subset latino — cobre o português).
 */
export const jakarta = localFont({
  src: "../fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  style: "normal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const jetbrains = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  style: "normal",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
