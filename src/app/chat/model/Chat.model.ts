import { User } from './User.model';

export interface Chat {
  id?: number;
  name: string;
  owner: User;
  lastMessage: string;
  lastMessageDate: string;
  participants: Participant[];
  logo?: string;
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
