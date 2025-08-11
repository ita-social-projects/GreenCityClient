export interface PaginatedResponse<T> {
  page: T[];
  totalPages: number;
}

export interface ChatDto {
  id: number;
  chatId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  lastMessage?: MessageDto | null;
}

export interface AssetDto {
  type: 'IMAGE' | 'VIDEO' | 'FILE' | string;
  url: string;
}

export interface MessageDto {
  id: number;
  text: string;
  sendAt: string;
  fromManager: boolean;
  assets?: AssetDto[] | null;
}

export interface NewChatEvent {
  id: number;
  chatId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  lastMessage?: MessageDto | null;
}

export interface MessageEvent {
  id: number;
  chatId: number;
  text: string;
  sendAt: string;
  fromManager: boolean;
  assets?: AssetDto[] | null;
}

export interface ChatListItem {
  name: string;
  initial: string;
  chatId: string;
  chatInternalId: number;
  lastMessage: string;
  time: string;
  messages: ChatMessageView[];
}

export interface ChatMessageView {
  from: 'Me' | string;
  text: string;
  time: string;
  images: string[];
}

export type ClientInfoRecord = Record<string, unknown>;
export type ClientInfoData = ClientInfoRecord | { error: string } | null;
