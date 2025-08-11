export interface SocketAsset {
  type: 'IMAGE' | 'VIDEO' | string;
  url: string;
}

export interface SocketChatMessage {
  chatId: string | number;
  messageId?: number | string;
  fromManager: boolean;
  text: string | null;
  sendAt: string;
  assets?: SocketAsset[];
}
