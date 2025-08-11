import { AssetDto, MessageViewingStatus } from './chat-page.interface';

export interface SocketChatMessage {
  sendAt: string;
  text: string;
  fromManager: boolean;
  assets: AssetDto[];
  messageViewingStatus?: MessageViewingStatus;
}
