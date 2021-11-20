export interface Message {
  id?: number;
  chatId: number;
  senderId: number;
  messageText: string;
  messageDate: Date;
}
