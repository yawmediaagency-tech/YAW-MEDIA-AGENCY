import { NextResponse } from "next/server";
import { services } from "@/content/services";
import { validateContact } from "@/lib/validation";

/**
 * POST /api/contact — alternativa ao Netlify Forms (ver src/lib/contact-client.ts).
 * Usada em desenvolvimento e quando NEXT_PUBLIC_CONTACT_PROVIDER=api.
 *
 * Envio por email via Resend (https://resend.com) quando as variáveis
 * estiverem definidas (ver .env.example):
 *   RESEND_API_KEY, CONTACT_TO_EMAIL e (opcional) CONTACT_FROM_EMAIL.
 * Sem configuração, o pedido é validado e registado no log do servidor.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Pedido inválido." }, { status: 400 });
  }

  const { data, errors } = validateContact(body);
  if (errors) {
    return NextResponse.json(
      { ok: false, errors, message: "Verifique os campos assinalados." },
      { status: 422 },
    );
  }

  // Honeypot preenchido → provável bot: responde "ok" sem fazer nada
  if (data.website) return NextResponse.json({ ok: true });

  const serviceLabel = services.find((s) => s.id === data.service)?.label ?? "Outro / ainda não sei";

  const origem =
    typeof (body as { origem?: unknown })?.origem === "string" &&
    (body as { origem: string }).origem === "assistente"
      ? "Assistente de chat"
      : "Formulário de contacto";

  const text = [
    `Origem: ${origem}`,
    `Nome: ${data.name}`,
    `E-mail: ${data.email}`,
    `Empresa: ${data.company || "—"}`,
    `Serviço: ${serviceLabel}`,
    "",
    data.message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    console.info("[contacto] Nova mensagem (configure RESEND_API_KEY para receber por email):\n" + text);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Website YAW <onboarding@resend.dev>",
        to: to.split(",").map((e) => e.trim()),
        reply_to: data.email,
        subject: `Novo contacto: ${data.name}${data.company ? ` (${data.company})` : ""} — ${serviceLabel}`,
        text,
      }),
    });

    if (!res.ok) {
      console.error("[contacto] Falha no envio:", res.status, await res.text());
      return NextResponse.json(
        { ok: false, message: "Não foi possível enviar agora. Tente novamente ou escreva-nos por email." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contacto] Erro de rede:", err);
    return NextResponse.json(
      { ok: false, message: "Não foi possível enviar agora. Tente novamente ou escreva-nos por email." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
