export interface SocketNewChat {
  chatId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;

  lastMessage?: string | null;
  time?: string;
}
