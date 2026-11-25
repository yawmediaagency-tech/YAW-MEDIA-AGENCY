import { services } from "@/content/services";
import type { ContactErrors, ContactInput } from "@/lib/validation";

/** De onde veio o pedido — aparece no e-mail recebido. */
export type ContactSource = "formulario" | "assistente";

type SendResult = { ok: boolean; errors?: ContactErrors; message?: string };

/**
 * Envia um pedido de contacto (usado pelo formulário e pelo assistente de chat).
 *
 * Fornecedores (variável NEXT_PUBLIC_CONTACT_PROVIDER):
 * - "netlify" (por defeito): Netlify Forms — sem servidor de e-mail nem chaves.
 *   O formulário está registado em public/__forms.html; as notificações por
 *   e-mail configuram-se no painel do Netlify.
 * - "api": rota /api/contact, que envia por e-mail através do Resend.
 *
 * Em desenvolvimento (npm run dev) usa sempre /api/contact, que regista o pedido
 * no terminal. Com NEXT_PUBLIC_CONTACT_MODE=demo, o envio é apenas simulado.
 */
export async function sendContact(
  data: ContactInput,
  source: ContactSource = "formulario",
): Promise<SendResult> {
  if (process.env.NEXT_PUBLIC_CONTACT_MODE === "demo") {
    await new Promise((r) => setTimeout(r, 1100));
    return { ok: true };
  }

  const useNetlify =
    process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_CONTACT_PROVIDER !== "api";

  return useNetlify ? sendToNetlifyForms(data, source) : sendToApi(data, source);
}

async function sendToNetlifyForms(data: ContactInput, source: ContactSource): Promise<SendResult> {
  const serviceLabel = services.find((s) => s.id === data.service)?.label ?? "Outro / ainda não sei";
  const origem = source === "assistente" ? "Assistente de chat" : "Formulário de contacto";

  const body = new URLSearchParams({
    "form-name": "contacto",
    subject: `Novo pedido no site: ${data.name}${data.company ? ` (${data.company})` : ""} — ${serviceLabel}`,
    origem,
    name: data.name,
    email: data.email,
    company: data.company,
    service: serviceLabel,
    message: data.message,
    website: data.website,
  });

  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (res.ok) return { ok: true };
  return { ok: false, message: "Não foi possível enviar a mensagem. Tente novamente." };
}

async function sendToApi(data: ContactInput, source: ContactSource): Promise<SendResult> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, origem: source }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    errors?: ContactErrors;
    message?: string;
  };
  return { ok: res.ok && Boolean(json.ok), errors: json.errors, message: json.message };
}
