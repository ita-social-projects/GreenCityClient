import { Injectable, OnDestroy } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TelegramSocketService implements OnDestroy {
  private stompClient: Client;
  private connected = false;
  private chatSubjects: Map<number, Subject<any>> = new Map();
  private newChatsSubject = new Subject<any>();

  constructor() {
    this.initSocket();
  }

  private initSocket(): void {
    const socketUrl = 'https://greencity-ubs.greencity.cx.ua/socket';
    const socket = new SockJS(socketUrl);

    this.stompClient = Stomp.over(() => socket);
    this.stompClient.debug = (msg) => console.log('[STOMP DEBUG]', msg);
    this.stompClient.reconnectDelay = 2000;

    this.stompClient.onConnect = () => {
      this.connected = true;
      console.log('[STOMP CONNECTED]');
      this.subscribeToNewChats();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('[STOMP ERROR]', frame.headers['message']);
      console.error('[STOMP DETAILS]', frame.body);
    };

    this.stompClient.activate();
  }

  private subscribeToNewChats() {
    this.stompClient.subscribe('/topic/chats', (msg) => {
      this.newChatsSubject.next(JSON.parse(msg.body));
    });
  }

  subscribeToMessages(chatId: number): Observable<any> {
    if (!this.chatSubjects.has(chatId)) {
      const subject = new Subject<any>();
      this.chatSubjects.set(chatId, subject);

      const topic = `/topic/messages/${chatId}`;
      console.log('[SUBSCRIBING TO]', topic);

      this.stompClient.subscribe(topic, (msg) => {
        console.log('[SOCKET MESSAGE]', msg.body);
        subject.next(JSON.parse(msg.body));
      });
    }

    return this.chatSubjects.get(chatId).asObservable();
  }

  get newChats$(): Observable<any> {
    return this.newChatsSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.stompClient?.deactivate();
  }
}
