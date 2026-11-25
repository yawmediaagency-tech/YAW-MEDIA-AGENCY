/** Evento global para abrir o assistente a partir de qualquer botão do site. */
export const OPEN_CHAT_EVENT = "yaw:open-chat";

export type OpenChatDetail = {
  /** Começa logo o pedido de proposta guiado */
  lead?: boolean;
  /** Envia esta mensagem automaticamente */
  message?: string;
};

export function openChat(detail: OpenChatDetail = {}) {
  window.dispatchEvent(new CustomEvent<OpenChatDetail>(OPEN_CHAT_EVENT, { detail }));
}
