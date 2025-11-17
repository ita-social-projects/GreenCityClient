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
  isUpdated?: boolean;
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
  unreadMessagesCount?: number;
}

export interface PaginatedResponse<T> {
  page: T[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
}

export interface ChatMessageView {
  id?: number;
  from: string;
  text: string;
  time: string;
  isUpdated?: boolean;
  images?: string[];
  fileUrl?: string;
  fileName?: string;
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
  unreadMessagesCount?: number;
}

export interface ClientInfoData {
  id: number;
  chatId: string;
  dateForm: string;
  datePaid: string;
  orderStatusUk: string;
  orderStatusEn: string;
  paymentStatusUk: string;
  paymentStatusEn: string;
  paidAmount: number;
  orderFullPrice: number;
  amountBeforePayment: number;
  refundedBonuses: number;
  refundedMoney: number;
  bags: BagsTelegramChat[];
  orderComment: string;
  bonuses: number;
  certificate: [];
  additionalOrders: [];
  sender: Sender;
  address: AddressTelegramChat;
  completedOrdersCount: number;
  error?: string;
}

export type ClientInfoRecord = Record<string, unknown>;

export interface UserFromChat {
  email: string;
  firstName: string;
  lastName: string;
}

export interface SocketNewChat {
  chatId: string | number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  lastMessage?: MessageDto | null;
  unreadMessagesCount?: number;
  id?: number;
  chatInternalId?: number;
  internalId?: number;
}

export interface Sender {
  senderName: string;
  senderSurname: string;
  senderEmail: string;
  senderPhone: string;
}

export interface AddressTelegramChat {
  addressCityUk: string;
  addressCityEn: string;
  addressRegionUk: string;
  addressRegionEn: string;
  addressStreetUk: string;
  addressStreetEn: string;
  addressDistinctUk: string;
  addressDistinctEn: string;
  addressComment: string;
  houseNumber: string;
  houseCorpus: string;
  entranceNumber: string;
}

export interface BagsTelegramChat {
  serviceUk: string;
  serviceEn: string;
  capacity: number;
  fullPrice: number;
  count: number;
  totalPrice: number;
}
