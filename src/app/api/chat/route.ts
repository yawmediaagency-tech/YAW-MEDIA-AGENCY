import { NextResponse } from "next/server";
import { getBotReply } from "@/lib/chat/engine";

/**
 * POST /api/chat — ponte para o motor de IA da ChatUs.
 *
 * Com CHATUS_WEBHOOK_URL definido (e, opcionalmente, CHATUS_API_KEY), a mensagem
 * e o histórico recente são reencaminhados para a plataforma ChatUs, que deve
 * responder com JSON { "reply": "texto" }. Sem configuração, ou se a ChatUs
 * falhar, responde a base de conhecimento local (src/lib/chat/engine.ts).
 *
 * O widget só chama esta rota com NEXT_PUBLIC_CHAT_MODE=remote; por defeito
 * responde no próprio browser, sem servidor.
 */

type HistoryItem = { role: "user" | "bot"; text: string };

export async function POST(request: Request) {
  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Pedido inválido." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
  if (!message) return NextResponse.json({ ok: false, message: "Mensagem vazia." }, { status: 422 });

  const history: HistoryItem[] = Array.isArray(body.history)
    ? body.history
        .filter(
          (h): h is HistoryItem =>
            typeof h === "object" &&
            h !== null &&
            (h.role === "user" || h.role === "bot") &&
            typeof h.text === "string",
        )
        .slice(-12)
        .map((h) => ({ role: h.role, text: h.text.slice(0, 1000) }))
    : [];

  const webhook = process.env.CHATUS_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.CHATUS_API_KEY ? { Authorization: `Bearer ${process.env.CHATUS_API_KEY}` } : {}),
        },
        body: JSON.stringify({ source: "yaw-website", message, history }),
        signal: AbortSignal.timeout(12_000),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { reply?: unknown } | null;
        if (data && typeof data.reply === "string" && data.reply.trim()) {
          return NextResponse.json({ ok: true, reply: { intent: "chatus", text: data.reply.trim() } });
        }
      } else {
        console.error("[chat] ChatUs respondeu com", res.status);
      }
    } catch (err) {
      console.error("[chat] Falha ao contactar a ChatUs:", err);
    }
  }

  return NextResponse.json({ ok: true, reply: getBotReply(message) });
}
