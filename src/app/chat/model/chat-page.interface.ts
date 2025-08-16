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
  name: string;
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

export type ClientInfoRecord = Record<string, unknown>;
