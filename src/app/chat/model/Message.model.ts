import { Participant } from './Chat.model';

export interface Message {
  id?: number;
  roomId: number;
  senderId: number;
  content: string;
  createDate?: string;
  fileName?: string | null;
  fileType?: FileType | null;
  fileUrl?: string | null;
  likes?: Participant[];
}

export type MessageExtended = Message & {
  isFirstOfDay?: boolean;
  isLiked?: boolean;
};

export interface Messages {
  currentPage: number;
  page: Message[];
  totalElements: number;
  totalPages: number;
}

export interface MessagesToSave extends Messages {
  newMessagesAmount?: number;
}

export enum FileType {
  FILE = 'FILE',
  IMAGE = 'IMAGE'
}

export interface MessagesLikeDto {
  messageId: number;
  participantId: number;
}
