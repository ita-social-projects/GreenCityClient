export enum AssetType {
  IMAGE = 'IMAGE',
  FILE = 'FILE'
}

export enum DeliveryStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export enum MessageViewingStatus {
  UNREAD = 'UNREAD',
  VIEWED = 'VIEWED'
}

export interface AssetDto {
  id: number;
  url: string;
  type: AssetType;
  fileName: string;
  size: number;
  contentType: string;
}

export interface MessageDto {
  id: number;
  sendAt: string;
  text: string;
  fromManager: boolean;
  deliveryStatus: DeliveryStatus;
  assets: AssetDto[];
  messageViewingStatus?: MessageViewingStatus;
}

export interface ChatDto {
  id: number;
  chatId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  lastMessage?: MessageDto | null;
  user?: UserFromChat | null;
}

export interface PaginatedResponse<T> {
  page: T[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
}

export interface ChatMessageView {
  from: string;
  text: string;
  time: string;
  images?: string[];
  viewingStatus?: 'UNREAD' | 'VIEWED' | null;
}

export interface ChatListItem {
  fullName: string;
  nickname: string;
  initial: string;
  chatId: string;
  chatInternalId: number;
  lastMessage: string;
  time: string;
  messages: ChatMessageView[];
  viewingStatus?: MessageViewingStatus | 'UNREAD' | 'VIEWED';
}

export interface ClientInfoData {
  error?: string;
}

export type ClientInfoRecord = Record<string, unknown>;

export interface UserFromChat {
  email: string;
  firstName: string;
  lastName: string;
}

export type SocketNewChatBase = {
  chatId: string | number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  lastMessage?: MessageDto | null;
};

export type SocketNewChat =
  | (SocketNewChatBase & { id: number })
  | (SocketNewChatBase & { chatInternalId: number })
  | (SocketNewChatBase & { internalId: number });
