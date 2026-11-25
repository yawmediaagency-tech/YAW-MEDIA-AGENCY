"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  MESSAGE_MAX,
  emptyContact,
  serviceOptions,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactInput,
} from "@/lib/validation";
import { sendContact } from "@/lib/contact-client";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const inputBase =
  "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 " +
  "transition-[border-color,background-color,box-shadow] duration-300 outline-none " +
  "hover:border-white/20 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-4 focus:ring-brand-500/15";

export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactInput>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const id = (f: string) => `${uid}-${f}`;

  const update = (field: keyof ContactInput, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Revalida em tempo real só depois do primeiro "blur"
    if (field !== "website" && touched[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    }
  };

  const blur = (field: ContactField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerMessage(null);

    const { data, errors: found } = validateContact(values);
    if (found) {
      setErrors(found);
      setTouched({ name: true, email: true, company: true, service: true, message: true });
      // Leva o foco para o primeiro campo com erro
      const first = (["name", "email", "company", "service", "message"] as ContactField[]).find(
        (f) => found[f],
      );
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await sendContact(data);
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (res.errors) setErrors(res.errors);
      setServerMessage(res.message ?? "Não foi possível enviar a mensagem. Tente novamente.");
      setStatus("error");
    } catch {
      setServerMessage("Sem ligação ao servidor. Verifique a sua internet e tente novamente.");
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(emptyContact);
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  const fieldError = (f: ContactField) =>
    errors[f] ? (
      <motion.p
        id={id(`${f}-error`)}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 flex items-center gap-1.5 text-[13px] text-rose-300"
      >
        <AlertCircle aria-hidden className="size-3.5 shrink-0" />
        {errors[f]}
      </motion.p>
    ) : null;

  const describedBy = (f: ContactField) => (errors[f] ? id(`${f}-error`) : undefined);
  const errorRing = (f: ContactField) =>
    errors[f] ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/15" : "border-white/10";

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 glass sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[520px] flex-col items-start justify-center"
            role="status"
            aria-live="polite"
          >
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              className="grid size-16 place-items-center rounded-full bg-brand-500 text-ink shadow-[0_0_60px_-10px_rgb(30_204_153/0.8)]"
            >
              <Check className="size-7" strokeWidth={2.5} />
            </motion.span>
            <h3 className="mt-8 text-3xl font-bold tracking-[-0.03em]">Mensagem enviada!</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-white/70">
              Obrigado{values.name ? `, ${values.name.split(" ")[0]}` : ""}. A nossa equipa vai analisar o seu
              pedido e responde em até 24 horas úteis.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 text-sm font-semibold text-brand-400 underline-offset-4 hover:underline"
            >
              Enviar outra mensagem
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
            aria-describedby={serverMessage ? id("server") : undefined}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={id("name")} className="mb-2.5 block eyebrow text-white/60">
                  Nome <span className="text-brand-400">*</span>
                </label>
                <input
                  id={id("name")}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="O seu nome"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => blur("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  aria-required
                  className={cn(inputBase, errorRing("name"))}
                />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor={id("email")} className="mb-2.5 block eyebrow text-white/60">
                  E-mail <span className="text-brand-400">*</span>
                </label>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="nome@empresa.com"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => blur("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  aria-required
                  className={cn(inputBase, errorRing("email"))}
                />
                {fieldError("email")}
              </div>
            </div>

            <div>
              <label htmlFor={id("company")} className="mb-2.5 block eyebrow text-white/60">
                Empresa <span className="tracking-normal text-white/35 normal-case">(opcional)</span>
              </label>
              <input
                id={id("company")}
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Nome da empresa ou marca"
                value={values.company}
                onChange={(e) => update("company", e.target.value)}
                onBlur={() => blur("company")}
                aria-invalid={Boolean(errors.company)}
                aria-describedby={describedBy("company")}
                className={cn(inputBase, errorRing("company"))}
              />
              {fieldError("company")}
            </div>

            <fieldset aria-describedby={describedBy("service")}>
              <legend className="mb-2.5 block eyebrow text-white/60">
                Serviço pretendido <span className="text-brand-400">*</span>
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {serviceOptions.map((opt) => {
                  const checked = values.service === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={cn(
                        "group relative flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors duration-300",
                        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500",
                        checked
                          ? "border-brand-500/70 bg-brand-500/10 text-white"
                          : errors.service
                            ? "border-rose-400/40 text-white/70 hover:border-white/25"
                            : "border-white/10 text-white/70 hover:border-white/25 hover:text-white",
                        opt.value === "outro" && "sm:col-span-2",
                      )}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={opt.value}
                        checked={checked}
                        onChange={(e) => {
                          update("service", e.target.value);
                          setTouched((t) => ({ ...t, service: true }));
                          setErrors((er) => ({ ...er, service: undefined }));
                        }}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors duration-300",
                          checked ? "border-brand-500 bg-brand-500" : "border-white/25",
                        )}
                      >
                        {checked && <Check className="size-3 text-ink" strokeWidth={3} />}
                      </span>
                      {opt.label}
                    </label>
                  );
                })}
              </div>
              {fieldError("service")}
            </fieldset>

            <div>
              <div className="mb-2.5 flex items-baseline justify-between">
                <label htmlFor={id("message")} className="block eyebrow text-white/60">
                  Mensagem <span className="text-brand-400">*</span>
                </label>
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    values.message.length > MESSAGE_MAX ? "text-rose-300" : "text-white/35",
                  )}
                >
                  {values.message.length}/{MESSAGE_MAX}
                </span>
              </div>
              <textarea
                id={id("message")}
                name="message"
                rows={5}
                placeholder="Fale-nos do projeto: objetivos, prazos e orçamento estimado."
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                onBlur={() => blur("message")}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message")}
                aria-required
                className={cn(inputBase, "resize-y", errorRing("message"))}
              />
              {fieldError("message")}
            </div>

            {/* Honeypot anti-spam (invisível para pessoas) */}
            <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </label>
            </div>

            {serverMessage && (
              <p
                id={id("server")}
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
              >
                <AlertCircle aria-hidden className="size-4 shrink-0" />
                {serverMessage}
              </p>
            )}

            <div className="flex flex-col-reverse items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-white/40">
                Ao enviar, aceita ser contactado pela YAW
                <br className="hidden sm:block" /> sobre este pedido.
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting"}
                arrow={status !== "submitting"}
              >
                {status === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle aria-hidden className="size-4 animate-spin" />A enviar…
                  </span>
                ) : (
                  "Enviar mensagem"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
