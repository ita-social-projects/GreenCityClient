export interface SocketChatMessage {
  chatId: number;
  messageId: number | string;
  fromManager: boolean;
  text: string | null;
  sendAt: string;
}
