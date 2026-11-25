"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, MessageCircle, X } from "lucide-react";
import chatusIcon from "@/assets/partners/chatus-icon.png";
import {
  WELCOME,
  getBotReply,
  normalize,
  type BotReply,
  type ChatLink,
  type QuickReply,
} from "@/lib/chat/engine";
import { OPEN_CHAT_EVENT, type OpenChatDetail } from "@/lib/chat/open-chat";
import { sendContact } from "@/lib/contact-client";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { serviceOptions, validateField, type ContactInput } from "@/lib/validation";

type Msg = { id: number; role: "bot" | "user"; text: string; links?: ChatLink[] };
type LeadStep = "name" | "email" | "service" | "message" | "sending";
type Lead = { step: LeadStep; data: Partial<ContactInput>; note?: string };

const EASE = [0.16, 1, 0.3, 1] as const;
const CANCEL: QuickReply = { label: "Cancelar" };
const TEASER_KEY = "yaw-chat-teaser";

const { contact, partner } = siteConfig;

/**
 * Assistente virtual da YAW — Powered by ChatUs.
 * Responde a perguntas frequentes, encaminha para as secções do site e recolhe
 * pedidos de proposta (enviados para /api/contact, como o formulário).
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [quick, setQuick] = useState<QuickReply[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [teaser, setTeaser] = useState(false);
  const [unread, setUnread] = useState(true);

  const leadRef = useRef<Lead | null>(null);
  const idRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);
  const messagesRef = useRef<Msg[]>([]);

  /* ---------- mensagens ---------- */

  const addUser = useCallback(
    (text: string) => setMessages((m) => [...m, { id: ++idRef.current, role: "user", text }]),
    [],
  );

  const pushBot = useCallback((reply: Omit<BotReply, "intent">, fast = false) => {
    setQuick([]);
    setTyping(true);
    const delay = fast ? 250 : 420 + Math.min(900, reply.text.length * 7);
    const t = window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: ++idRef.current, role: "bot", text: reply.text, links: reply.links }]);
      setQuick(reply.quickReplies ?? []);
    }, delay);
    timers.current.push(t);
  }, []);

  const history = (msgs: Msg[]) => msgs.slice(-12).map((m) => ({ role: m.role, text: m.text }));

  const answer = useCallback(
    async (text: string, msgs: Msg[]) => {
      if (process.env.NEXT_PUBLIC_CHAT_MODE === "remote") {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, history: history(msgs) }),
          });
          const json = (await res.json()) as { ok?: boolean; reply?: BotReply };
          if (res.ok && json.reply?.text) return pushBot(json.reply);
        } catch {
          /* recorre à base local */
        }
      }
      pushBot(getBotReply(text));
    },
    [pushBot],
  );

  /* ---------- pedido de proposta guiado ---------- */

  const startLead = useCallback(() => {
    leadRef.current = { step: "name", data: {} };
    pushBot({
      text: "Ótimo! Vamos preparar o seu pedido de proposta. Para começar, como se chama?",
      quickReplies: [CANCEL],
    });
  }, [pushBot]);

  const leadStep = async (text: string) => {
    const lead = leadRef.current;
    if (!lead) return;

    if (normalize(text).trim() === "cancelar") {
      leadRef.current = null;
      return pushBot({ text: "Sem problema. Em que mais posso ajudar?", quickReplies: WELCOME.quickReplies });
    }

    const first = (lead.data.name ?? "").split(" ")[0];

    if (lead.step === "name") {
      const err = validateField("name", text);
      if (err) return pushBot({ text: err, quickReplies: [CANCEL] }, true);
      lead.data.name = text.trim();
      lead.step = "email";
      return pushBot({
        text: `Prazer, ${text.trim().split(" ")[0]}! Qual é o seu e-mail, para lhe enviarmos a proposta?`,
        quickReplies: [CANCEL],
      });
    }

    if (lead.step === "email") {
      const err = validateField("email", text);
      if (err) return pushBot({ text: err, quickReplies: [CANCEL] }, true);
      lead.data.email = text.trim();
      lead.step = "service";
      return pushBot({
        text: "Que serviço procura?",
        quickReplies: [...serviceOptions.map((o) => ({ label: o.label })), CANCEL],
      });
    }

    if (lead.step === "service") {
      const match = serviceOptions.find((o) => normalize(o.label) === normalize(text));
      lead.data.service = match?.value ?? "outro";
      if (!match) lead.note = `Serviço indicado: ${text.trim()}`;
      lead.step = "message";
      return pushBot({
        text: "Conte-me, em poucas palavras, sobre o projeto: objetivos, prazos e, se possível, orçamento.",
        quickReplies: [CANCEL],
      });
    }

    if (lead.step === "message") {
      const body = [lead.note, text.trim()].filter(Boolean).join("\n");
      const err = validateField("message", body);
      if (err) return pushBot({ text: err, quickReplies: [CANCEL] }, true);
      lead.step = "sending";
      setTyping(true);
      setQuick([]);
      try {
        const res = await sendContact(
          {
            name: lead.data.name ?? "",
            email: lead.data.email ?? "",
            company: "",
            service: lead.data.service ?? "outro",
            message: body,
            website: "",
          },
          "assistente",
        );
        setTyping(false);
        leadRef.current = null;
        if (res.ok) {
          return pushBot(
            {
              text: `Pedido enviado! A equipa da YAW vai responder para ${lead.data.email} — em média, em 24 horas. Obrigado, ${first}.`,
              quickReplies: [{ label: "Ver portefólio" }, { label: "Serviços" }],
            },
            true,
          );
        }
        throw new Error(res.message);
      } catch {
        setTyping(false);
        leadRef.current = null;
        return pushBot(
          {
            text: `Não consegui enviar o pedido agora. Pode escrever-nos para ${contact.email} ou ligar para ${contact.phone}.`,
            links: [
              { label: "Enviar e-mail", href: `mailto:${contact.email}` },
              { label: "Ligar", href: contact.phoneHref },
            ],
          },
          true,
        );
      }
    }
  };

  /* ---------- entrada do utilizador ---------- */

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    addUser(text);
    setInput("");
    setQuick([]);
    if (leadRef.current) {
      void leadStep(text);
      return;
    }
    void answer(text, messagesRef.current);
  };

  const onQuick = (q: QuickReply) => {
    if (typing) return;
    if (q.action === "lead") {
      addUser(q.label);
      setQuick([]);
      startLead();
      return;
    }
    send(q.label);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  /* ---------- abrir / fechar ---------- */

  const welcomed = useRef(false);
  const openPanel = useCallback(() => {
    setOpen(true);
    setTeaser(false);
    setUnread(false);
    // Mensagem de boas-vindas na primeira abertura
    if (!welcomed.current) {
      welcomed.current = true;
      pushBot(WELCOME, true);
    }
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* sem armazenamento */
    }
  }, [pushBot]);

  const closePanel = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  // Foco no campo de texto ao abrir; Escape fecha
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Desce para a última mensagem
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, quick]);

  // Abrir a partir de outros botões do site (ex.: secção ChatUs)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenChatDetail>).detail ?? {};
      openPanel();
      if (detail.lead && !leadRef.current) {
        const t = window.setTimeout(() => {
          addUser("Quero pedir uma proposta");
          startLead();
        }, 900);
        timers.current.push(t);
      }
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [openPanel, startLead, addUser]);

  // Convite discreto passados alguns segundos (uma vez por sessão)
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {
      /* sem armazenamento */
    }
    if (seen) return;
    const t = window.setTimeout(() => setTeaser(true), 7000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const dismissTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* sem armazenamento */
    }
  };

  return (
    <>
      {/* Convite */}
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed right-5 bottom-24 z-[70] hidden w-[min(300px,calc(100vw-2.5rem))] origin-bottom-right sm:block"
          >
            <div className="relative rounded-2xl border border-white/10 bg-ink-raised/95 p-4 pr-10 text-sm text-white shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl">
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label="Fechar convite"
                className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="size-3.5" />
              </button>
              <button type="button" onClick={openPanel} className="text-left">
                <span className="font-semibold">Olá! Precisa de ajuda?</span>
                <span className="mt-1 block leading-relaxed text-white/65">
                  Posso apresentar os serviços ou preparar um pedido de proposta consigo.
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão flutuante */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-controls="assistente-yaw"
        aria-label={open ? "Fechar assistente" : "Abrir assistente de conversa"}
        className={cn(
          "group fixed right-4 bottom-4 z-[70] grid size-13 place-items-center rounded-full bg-brand-500 text-ink sm:right-5 sm:bottom-5 sm:size-14",
          "shadow-[0_0_0_3px_#0b0b0b,0_0_0_4px_rgb(30_204_153/0.5),0_16px_40px_-10px_rgb(30_204_153/0.7)] transition-transform duration-300 hover:scale-105 active:scale-95",
          open && "max-sm:hidden",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
            >
              <MessageCircle className="size-6" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
        {unread && !open && (
          <span aria-hidden className="absolute top-0.5 right-0.5 flex size-3.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex size-3.5 rounded-full border-2 border-brand-500 bg-white" />
          </span>
        )}
      </button>

      {/* Painel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="assistente-yaw"
            role="dialog"
            aria-label="Assistente YAW"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={cn(
              "fixed inset-0 z-[80] flex flex-col overflow-hidden bg-ink-soft text-white",
              "sm:inset-auto sm:right-5 sm:bottom-24 sm:h-[min(640px,calc(100svh-8rem))] sm:w-[400px] sm:origin-bottom-right sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]",
            )}
          >
            {/* Cabeçalho */}
            <div className="relative flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_0%_0%,rgb(30_204_153/0.16),transparent_60%)]"
              />
              <span className="relative grid size-10 place-items-center rounded-full bg-brand-500">
                <svg viewBox="0 0 270 385" aria-hidden className="h-4 w-auto fill-ink">
                  <polygon points="70,0 270,0 186,385 0,385" />
                </svg>
                <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-ink-soft bg-brand-400" />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="font-semibold tracking-tight">Assistente YAW</p>
                <p className="text-xs text-white/55">Online · responde em segundos</p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Fechar assistente"
                className="relative grid size-9 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Conversa */}
            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}
                >
                  <p
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-line",
                      m.role === "user"
                        ? "rounded-br-md bg-brand-500 text-ink"
                        : "rounded-bl-md border border-white/[0.06] bg-white/[0.06] text-white/90",
                    )}
                  >
                    <span className="sr-only">{m.role === "user" ? "Você: " : "Assistente: "}</span>
                    {m.text}
                  </p>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((l) => {
                        const internal = l.href.startsWith("#");
                        const external = /^https?:/.test(l.href);
                        return (
                          <a
                            key={l.href}
                            href={l.href}
                            onClick={() => internal && setOpen(false)}
                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="inline-flex items-center gap-1 rounded-full border border-brand-500/40 px-3 py-1.5 text-xs font-medium text-brand-300 transition-colors hover:bg-brand-500 hover:text-ink"
                          >
                            {l.label}
                            <ArrowUpRight aria-hidden className="size-3" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ))}

              {typing && (
                <div
                  className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.06] px-4 py-3.5"
                  aria-label="O assistente está a escrever"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="size-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Respostas rápidas */}
            {quick.length > 0 && !typing && (
              <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-3">
                {quick.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => onQuick(q)}
                    className={cn(
                      "shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                      q.action === "lead"
                        ? "border-brand-500 bg-brand-500 text-ink hover:bg-brand-400"
                        : q.label === CANCEL.label
                          ? "border-white/10 text-white/50 hover:text-white"
                          : "border-white/15 text-white/85 hover:border-brand-500/60 hover:text-white",
                    )}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {/* Campo de mensagem */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/[0.08] p-3">
              <label htmlFor="chat-input" className="sr-only">
                Escreva a sua mensagem
              </label>
              <input
                ref={inputRef}
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva a sua mensagem…"
                autoComplete="off"
                maxLength={500}
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[14.5px] text-white outline-none placeholder:text-white/35 focus:border-brand-500/70"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Enviar mensagem"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-500 text-ink transition-[opacity,transform] hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <ArrowUp className="size-5" strokeWidth={2.25} />
              </button>
            </form>

            <p className="flex items-center justify-center gap-1.5 pb-3 text-[11px] text-white/40">
              Powered by
              <a
                href="#chatus"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 font-semibold text-white/75 underline-offset-2 hover:text-chatus-light hover:underline"
              >
                <Image src={chatusIcon} alt="" sizes="14px" className="size-3.5" />
                {partner.name}
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
