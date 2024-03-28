import { Subject } from 'rxjs';

export enum SocketClientState {
  ATTEMPTING,
  CONNECTED
}

export interface SocketConnection {
  url: string;
  state: Subject<SocketClientState>;
  socket: any;
}
