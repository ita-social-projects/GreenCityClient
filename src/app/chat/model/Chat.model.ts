import { User } from './User.model';

export interface Chat {
  id?: number;
  name: string;
  owner: User;
  lastMessage: string;
  lastMessageDate: Date;
  participants: User[];
}
