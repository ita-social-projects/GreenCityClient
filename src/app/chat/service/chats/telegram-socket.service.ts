import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { Client, IFrame, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { SocketNewChat } from '../../model/socket-new-chat.interface';
import { SocketChatMessage } from '../../model/socket-chat-message.interface';
import { environment } from '@environment/environment';

@Injectable({ providedIn: 'root' })
export class TelegramSocketService implements OnDestroy {
  private stompClient!: Client;
  private connected = false;

  private readonly socketHttpUrl = environment.ubsSocket;

  private readonly chatSubjects = new Map<number, Subject<SocketChatMessage>>();
  private readonly chatSubscriptions = new Map<number, StompSubscription | null>();

  private readonly newChatsSubject = new Subject<SocketNewChat>();
  private newChatsSubscription: StompSubscription | null = null;

  constructor(private readonly zone: NgZone) {
    this.initSocket();
    window.addEventListener('beforeunload', () => this.stompClient?.deactivate());
  }

  get newChats$(): Observable<SocketNewChat> {
    return this.newChatsSubject.asObservable();
  }

  subscribeToMessages(chatId: number): Observable<SocketChatMessage> {
    const existing = this.chatSubjects.get(chatId);
    if (existing) {
      return existing.asObservable();
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
      this.chatSubjects.forEach((s) => s.complete());
      this.chatSubjects.clear();
    }
  }
  private isSocketNewChat(p: unknown): p is SocketNewChat {
    if (!p || typeof p !== 'object') {
      return false;
    }
    const o = p as Record<string, unknown>;
    const hasOneId = typeof o.id === 'number' || typeof o.chatInternalId === 'number' || typeof o.internalId === 'number';
    const chatIdOk = typeof o.chatId === 'string' || typeof o.chatId === 'number';
    return hasOneId && chatIdOk;
  }

  private initSocket(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.socketHttpUrl) as any,
      reconnectDelay: 2000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectHeaders: this.buildAuthHeaders()
    });

    this.stompClient.onConnect = (_frame: IFrame) => {
      this.connected = true;
      this.subscribeToNewChatsCore();
      this.chatSubjects.forEach((_s, id) => this.bindChatSubscription(id));
    };

    this.stompClient.onStompError = (f: IFrame) => {
      console.error('[STOMP ERROR]', f.headers?.message, f.body);
    };

    this.stompClient.onWebSocketClose = (e) => {
      this.connected = false;
      this.chatSubscriptions.forEach((sub, id) => {
        try {
          sub?.unsubscribe();
        } catch {
          /* empty */
        }
        this.chatSubscriptions.set(id, null);
      });
      try {
        this.newChatsSubscription?.unsubscribe();
      } catch {
        /* empty */
      }
      this.newChatsSubscription = null;
      this.stompClient.connectHeaders = this.buildAuthHeaders();
    };

    this.stompClient.onWebSocketError = (e) => {
      console.error('[STOMP onWebSocketError]', e);
    };

    this.stompClient.activate();
  }

  private buildAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private subscribeToNewChatsCore(): void {
    this.newChatsSubscription?.unsubscribe();
    this.newChatsSubscription = this.stompClient.subscribe('/topic/chats', (msg: IMessage) => {
      try {
        const parsed = JSON.parse(msg.body);
        if (this.isSocketNewChat(parsed)) {
          this.zone.run(() => this.newChatsSubject.next(parsed));
        } else {
          console.error('[/topic/chats] payload shape invalid', parsed);
        }
      } catch (e) {
        console.error('[PARSE /topic/chats]', e, msg.body);
      }
    });
  }

  private bindChatSubscription(chatId: number): void {
    if (this.chatSubscriptions.get(chatId)) {
      return;
    }

    const topic = `/topic/messages/${chatId}`;
    const sub = this.stompClient.subscribe(topic, (msg: IMessage) => {
      const subject = this.chatSubjects.get(chatId);
      if (!subject) {
        return;
      }
      try {
        const payload = JSON.parse(msg.body) as SocketChatMessage;
        this.zone.run(() => subject.next(payload));
      } catch (e) {
        console.error('[PARSE]', topic, e, msg.body);
      }
    });

    this.chatSubscriptions.set(chatId, sub);
  }
}
