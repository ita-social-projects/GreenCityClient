export interface SocketNewChat {
  chatId: number;
  name: string;
  lastMessage?: string | null;
  time?: string;
}
