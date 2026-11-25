import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de partilha (Open Graph / redes sociais), gerada no build com as fontes da marca. */
/** Fontes lidas uma vez e guardadas em cache — a imagem é gerada no build (estática). */
async function loadFonts() {
  "use cache";
  const dir = join(process.cwd(), "src/assets/og");
  const [jakarta, mono] = await Promise.all([
    readFile(join(dir, "PlusJakartaSans-Bold.ttf")),
    readFile(join(dir, "JetBrainsMono-Regular.ttf")),
  ]);
  // ArrayBuffer (serializável) para poder ficar em cache
  const toArrayBuffer = (b: Buffer) =>
    b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  return { jakarta: toArrayBuffer(jakarta), mono: toArrayBuffer(mono) };
}

export default async function OpenGraphImage() {
  const { jakarta, mono } = await loadFonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "white",
        fontFamily: "Jakarta",
        background: "linear-gradient(180deg,#0b0b0b 0%,#0b0b0b 45%,#0a3a2c 85%,#15936e 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "Mono",
          fontSize: 20,
          letterSpacing: 4,
          color: "rgba(255,255,255,0.65)",
        }}
      >
        <span>YAW MEDIA AGENCY</span>
        <span>MARKETING DIGITAL</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 82,
            lineHeight: 1.04,
            letterSpacing: -3.5,
          }}
        >
          <span>Elevamos a sua marca</span>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>ao próximo nível digital.</span>
        </div>
        <svg width="120" height="171" viewBox="0 0 270 385">
          <polygon points="70,0 270,0 186,385 0,385" fill="#1ecc99" />
        </svg>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: jakarta, weight: 700, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
