import { Injectable, OnDestroy } from '@angular/core';
import { Client, IFrame, IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { SocketNewChat } from '../../model/socket-new-chat.interface';
import { SocketChatMessage } from '../../model/socket-chat-message.interface';

@Injectable({ providedIn: 'root' })
export class TelegramSocketService implements OnDestroy {
  private stompClient!: Client;
  private connected = false;
  private readonly chatSubjects = new Map<number, Subject<SocketChatMessage>>();
  private readonly chatSubscriptions = new Map<number, StompSubscription | null>();
  private newChatsSubject = new Subject<SocketNewChat>();
  private newChatsSubscription: StompSubscription | null = null;
  private readonly socketUrl = 'wss://greencity-ubs.greencity.cx.ua/socket/websocket';

  constructor() {
    this.initSocket();
  }

  get newChats$(): Observable<SocketNewChat> {
    return this.newChatsSubject.asObservable();
  }

  subscribeToMessages(chatId: number): Observable<SocketChatMessage> {
    if (this.chatSubjects.has(chatId)) {
      return this.chatSubjects.get(chatId)?.asObservable();
    }
    const subject = new Subject<SocketChatMessage>();
    this.chatSubjects.set(chatId, subject);
    if (this.connected) {
      this.bindChatSubscription(chatId);
    } else {
      this.chatSubscriptions.set(chatId, null);
    }
    return subject.asObservable();
  }

  ngOnDestroy(): void {
    try {
      this.newChatsSubscription?.unsubscribe();
      this.chatSubscriptions.forEach((s) => s?.unsubscribe());
      this.chatSubscriptions.clear();
      this.stompClient?.deactivate();
    } finally {
      this.connected = false;
      this.chatSubjects.clear();
    }
  }

  private initSocket(): void {
    const ws = new WebSocket(this.socketUrl);
    this.stompClient = Stomp.over(() => ws as any);
    this.stompClient.debug = (m) => console.log('[STOMP]', m);
    this.stompClient.reconnectDelay = 2000;
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.stompClient.connectHeaders = { Authorization: `Bearer ${token}` };
    }

    this.stompClient.onConnect = (frame: IFrame) => {
      console.log('[STOMP onConnect]', frame.headers);
      this.connected = true;
      this.subscribeToNewChatsCore();
      this.chatSubjects.forEach((_s, id) => this.bindChatSubscription(id));
    };
    this.stompClient.onWebSocketClose = (e) => {
      this.connected = false;
    };
    this.stompClient.onWebSocketError = (e) => console.error('[STOMP onWebSocketError]', e);
    this.stompClient.onStompError = (f: IFrame) => console.error('[STOMP ERROR]', f.headers?.message, f.body);

    this.stompClient.activate();
  }

  private subscribeToNewChatsCore(): void {
    this.newChatsSubscription?.unsubscribe();
    this.newChatsSubscription = this.stompClient.subscribe('/topic/chats', (msg: IMessage) => {
      try {
        this.newChatsSubject.next(JSON.parse(msg.body));
      } catch (e) {
        console.error('[PARSE /topic/chats]', e, msg.body);
      }
    });
  }

  private bindChatSubscription(chatId: number): void {
    const existing = this.chatSubscriptions.get(chatId);
    if (existing) {
      return;
    }
    const topic = `/topic/messages/${chatId}`;
    const sub = this.stompClient.subscribe(topic, (msg: IMessage) => {
      const subject = this.chatSubjects.get(chatId);
      if (!subject) {
        return;
      }
      try {
        subject.next(JSON.parse(msg.body));
      } catch (e) {
        console.error('[PARSE]', topic, e, msg.body);
      }
    });
    this.chatSubscriptions.set(chatId, sub);
  }
}
