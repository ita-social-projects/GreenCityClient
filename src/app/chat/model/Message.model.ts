export interface Message {
  id?: number;
  roomId: number;
  senderId: number;
  content: string;
  createDate: Date;
}
