export interface Message {
  id?: number;
  roomId: number;
  senderId: number;
  content: string;
  createDate?: string;
}

export interface Messages {
  currentPage: number;
  page: Message[];
  totalElements: number;
  totalPages: number;
}
