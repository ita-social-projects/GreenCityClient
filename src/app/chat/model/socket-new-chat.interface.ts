import { AssetDto, MessageDto, MessageViewingStatus } from './chat-page.interface';

type WithId = { id: number };
type WithChatInternalId = { chatInternalId: number };
type WithInternalId = { internalId: number };

type IdCarrier = WithId | WithChatInternalId | WithInternalId;

export interface SocketNewChatBase {
  chatId: string | number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  lastMessage?: MessageDto | null;
}

export type SocketNewChat = SocketNewChatBase & IdCarrier;
