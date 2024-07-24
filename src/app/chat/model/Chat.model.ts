export interface Chat {
  id?: number;
  name: string;
  chatType: string;
  ownerId: number;
  amountUnreadMessages: number | null;
  lastMessage: string;
  lastMessageDateTime: string;
  participants: Participant[];
  logo?: string;
  tariffId: number;
}
export interface ChatDto {
  page: Chat[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
}
export interface FriendChatInfo {
  friendId: number;
  chatExists: boolean;
  chatId: number;
}

export interface Participant {
  email?: string;
  id: number;
  name: string;
  profilePicture: string;
  role?: string;
  rooms?: any[];
  userStatus?: string;
}

export interface LocationForChat {
  id: number;
  locationStatus: string;
  regionNameUk: string;
  regionNameEn: string;
  latitude: number;
  longitude: number;
  nameUk: string;
  nameEn: string;
  chat: Chat | null;
}
