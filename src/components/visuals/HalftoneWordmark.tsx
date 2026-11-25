"use client";

import { useEffect, useRef } from "react";
import { hwfFitSize, hwfHex, hwfRadius, hwfStep, hwfWarmth } from "@/components/ui/halftone-wordmark-footer";
import { cn } from "@/lib/utils";

/**
 * Versão "hero" da animação de retícula do rodapé (mesmas contas, exportadas por
 * halftone-wordmark-footer.tsx): a palavra enorme em pontos, cortada pela borda de
 * baixo, sobre fundo transparente — para assentar no fundo da secção.
 *
 * - Na entrada, os pontos sobem e "assentam" no lugar (desativado com reduzir movimento).
 * - O ponteiro empurra os pontos (molas) e aquece-os para o verde da marca.
 * - O clique solta uma onda de choque.
 * - Ouve os eventos no elemento pai (a secção), por isso o conteúdo pode ficar por cima.
 * - Dorme quando nada se mexe e fora do ecrã.
 */
type HalftoneWordmarkProps = {
  wordmark?: string;
  /** Cor dos pontos parados */
  ink?: string;
  /** Cor que o ponto ganha ao sair do lugar */
  warm?: string;
  /** Distância entre pontos (px) */
  dotGap?: number;
  /** Alcance do ponteiro (px) */
  radius?: number;
  /** Fração da altura das letras escondida abaixo da borda (0–0,6) */
  crop?: number;
  /** Largura ocupada pela palavra, em fração da largura da secção */
  span?: number;
  /** Grão de impressão sobre os pontos (0–1) */
  grain?: number;
  fontFamily: string;
  fontWeight?: number;
  /** Animação de entrada */
  intro?: boolean;
  className?: string;
};

export function HalftoneWordmark({
  wordmark = "yaw",
  ink = "#eceeec",
  warm = "#1ecc99",
  dotGap = 6,
  radius = 90,
  crop = 0.2,
  span = 1.02,
  grain = 0.5,
  fontFamily,
  fontWeight = 800,
  intro = true,
  className,
}: HalftoneWordmarkProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;
    const host = root.parentElement ?? root;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inkRgb = hwfHex(ink) ?? [236, 238, 236];
    const warmRgb = hwfHex(warm) ?? [30, 204, 153];

    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let started = false;
    let playIntro = intro && !reduced;
    let bandTop = 0;
    let ring = { x: 0, y: 0, t: -1 };
    // Vetor plano por ponto: x, y, vx, vy, hx, hy, raio
    let dots = new Float32Array(0);
    let count = 0;
    let grainPattern: CanvasPattern | null = null;

    const layout = () => {
      const nw = Math.max(1, root.clientWidth);
      const nh = Math.max(1, root.clientHeight);
      if (nw === w && nh === h && count > 0) return;
      w = nw;
      h = nh;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Máscara 1x com a palavra no tamanho que preenche a largura
      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      m.font = `${fontWeight} 100px ${fontFamily}`;
      const fit = hwfFitSize(m.measureText(wordmark).width, w * span);
      m.font = `${fontWeight} ${fit}px ${fontFamily}`;
      const box = m.measureText(wordmark);
      const cap = box.actualBoundingBoxAscent || fit * 0.72;
      const c = Math.max(0, Math.min(0.6, crop));
      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      m.fillText(wordmark, (w - box.width) / 2, h + cap * c);
      const img = m.getImageData(0, 0, w, h).data;

      const gap = Math.max(3, dotGap);
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const firstRow = Math.max(0, Math.floor((h - cap * (1 - c) - gap * 2) / gap));
      const tmp: number[] = [];
      bandTop = h;
      for (let gy = firstRow; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const cov = sum / (9 * 255);
          if (cov < 0.06) continue;
          const hx = gx * gap + gap / 2;
          const hy = gy * gap + gap / 2;
          bandTop = Math.min(bandTop, hy);
          // Entrada: os pontos começam abaixo e ligeiramente dispersos
          const sx = playIntro ? hx + (Math.random() - 0.5) * 140 : hx;
          const sy = playIntro ? hy + 80 + Math.random() * 260 : hy;
          tmp.push(sx, sy, 0, 0, hx, hy, hwfRadius(cov, gap));
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;
      playIntro = false;

      // Grão de impressão (ladrilho fixo), aplicado só sobre os pontos
      const tile = document.createElement("canvas");
      tile.width = 256;
      tile.height = 256;
      const g = tile.getContext("2d");
      if (g) {
        const id = g.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
      }
      grainPattern = ctx.createPattern(tile, "repeat");
      awake = true;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const r = reduced ? 0 : Math.max(0, radius);
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.9;
      let moving = false;

      for (let i = 0; i < count; i++) {
        const j = i * 7;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26);
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r);
          x = s[0];
          y = s[1];
          vx = s[2];
          vy = s[3];
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) {
            moving = true;
          } else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }
        const k = hwfWarmth(x, y, hx, hy, 28);
        ctx.fillStyle =
          k > 0.02
            ? `rgb(${Math.round(inkRgb[0] + (warmRgb[0] - inkRgb[0]) * k)},${Math.round(
                inkRgb[1] + (warmRgb[1] - inkRgb[1]) * k,
              )},${Math.round(inkRgb[2] + (warmRgb[2] - inkRgb[2]) * k)})`
            : ink;
        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, 6.2832);
        ctx.fill();
      }

      if (grainPattern && grain > 0) {
        ctx.globalAlpha = Math.min(1, grain) * 0.18;
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, bandTop - dotGap * 2, w, h - bandTop + dotGap * 2);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      // Só continua a desenhar se algo se mexe ou o ponteiro está perto da palavra
      awake = moving || ringAge < 900 || (px > -1e4 && py > bandTop - r);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      awake = true;
      if (!raf && visible && started) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return [((e.clientX - b.left) * w) / (b.width || w), ((e.clientY - b.top) * h) / (b.height || h)];
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      px = p[0];
      py = p[1];
      if (py > bandTop - radius) wake();
    };
    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      if ((e.target as HTMLElement).closest("a,button,input,textarea,select,label")) return;
      const p = toLocal(e);
      if (p[1] < bandTop - radius * 2) return;
      ring = { x: p[0], y: p[1], t: performance.now() };
      wake();
    };

    // Espera pela fonte da página para a palavra nascer já na fonte certa
    let alive = true;
    const start = () => {
      if (!alive || started) return;
      started = true;
      layout();
      wake();
    };
    const fallback = window.setTimeout(start, 1500);
    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => {
      if (!started) return;
      layout();
      wake();
    });
    ro.observe(root);
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    io.observe(root);

    return () => {
      alive = false;
      window.clearTimeout(fallback);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [wordmark, ink, warm, dotGap, radius, crop, span, grain, fontFamily, fontWeight, intro]);

  return (
    <div ref={rootRef} aria-hidden className={cn("pointer-events-none", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
    </div>
  );
}
