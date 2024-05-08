import { User } from './User.model';

export interface Chat {
  id?: number;
  name: string;
  chatType: string;
  ownerId: User;
  amountUnreadMessages: number | null;
  lastMessage: string;
  lastMessageDateTime: string;
  participants: Participant[];
  logo?: string;
  tariffId: number;
}
export interface FriendChatInfo {
  friendId: number;
  chatExists: boolean;
  chatId: number;
}

export interface Participant {
  email: string;
  id: number;
  name: string;
  profilePicture: string;
  role: string;
  rooms: any[];
  userStatus: string;
}
