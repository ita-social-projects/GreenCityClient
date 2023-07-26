import { User } from './User.model';

export interface Chat {
  id?: number;
  name: string;
  owner: User;
  lastMessage: string;
  lastMessageDate: string;
  participants: User[];
  logo?: string;
}

export interface FriendChatInfo {
  friendId: number;
  chatId: number;
}
