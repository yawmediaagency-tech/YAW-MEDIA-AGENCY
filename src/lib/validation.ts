import { services } from "@/content/services";

/**
 * Validação do formulário de contacto — partilhada entre o cliente (feedback
 * imediato) e a rota /api/contact (validação de servidor). Sem dependências.
 */

export const serviceOptions = [
  ...services.map((s) => ({ value: s.id as string, label: s.label })),
  { value: "outro", label: "Outro / ainda não sei" },
];

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  /** Honeypot anti-spam — tem de ficar vazio */
  website: string;
};

export type ContactField = keyof Omit<ContactInput, "website">;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const emptyContact: ContactInput = {
  name: "",
  email: "",
  company: "",
  service: "",
  message: "",
  website: "",
};

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function validateField(field: ContactField, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (!value) return "Indique o seu nome.";
      if (value.length < 2) return "O nome parece demasiado curto.";
      if (value.length > 80) return "Use no máximo 80 caracteres.";
      return;
    case "email":
      if (!value) return "Indique o seu e-mail.";
      if (!EMAIL_RE.test(value)) return "Introduza um e-mail válido (ex.: nome@empresa.com).";
      return;
    case "company":
      if (value.length > 100) return "Use no máximo 100 caracteres.";
      return;
    case "service":
      if (!value) return "Escolha o serviço pretendido.";
      if (!serviceOptions.some((o) => o.value === value)) return "Serviço inválido.";
      return;
    case "message":
      if (!value) return "Conte-nos um pouco sobre o projeto.";
      if (value.length < MESSAGE_MIN) return `Escreva pelo menos ${MESSAGE_MIN} caracteres.`;
      if (value.length > MESSAGE_MAX) return `Use no máximo ${MESSAGE_MAX} caracteres.`;
      return;
  }
}

const FIELDS: ContactField[] = ["name", "email", "company", "service", "message"];

export function validateContact(input: unknown): {
  data: ContactInput;
  errors: ContactErrors | null;
} {
  const source = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const data = { ...emptyContact };
  for (const key of Object.keys(emptyContact) as (keyof ContactInput)[]) {
    const v = source[key];
    data[key] = typeof v === "string" ? v.trim() : "";
  }

  const errors: ContactErrors = {};
  for (const field of FIELDS) {
    const error = validateField(field, data[field]);
    if (error) errors[field] = error;
  }

  return { data, errors: Object.keys(errors).length ? errors : null };
}
