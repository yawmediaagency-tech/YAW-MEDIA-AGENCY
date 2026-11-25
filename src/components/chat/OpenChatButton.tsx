"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { openChat, type OpenChatDetail } from "@/lib/chat/open-chat";

/** Botão que abre o assistente de conversa (opcionalmente já no pedido de proposta). */
export function OpenChatButton({
  children,
  variant = "primary",
  size = "lg",
  detail,
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "glass" | "ink" | "outline";
  size?: "md" | "lg";
  detail?: OpenChatDetail;
  className?: string;
}) {
  return (
    <Button variant={variant} size={size} className={className} onClick={() => openChat(detail)}>
      {children}
    </Button>
  );
}
