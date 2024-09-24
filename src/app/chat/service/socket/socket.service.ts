import { Injectable, OnDestroy } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from '@environment/environment';
import { CompatClient, IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import { Message, MessagesLikeDto } from '../../model/Message.model';
import { ChatsService } from '../chats/chats.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { FriendChatInfo, Participant } from '../../model/Chat.model';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Title } from '@angular/platform-browser';
import { SocketClientState } from '@global-service/socket/socket-state.enum';
import { BehaviorSubject } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: WebSocket;
  private stompClient: CompatClient;
  private socketState: BehaviorSubject<SocketClientState>;
  private backendSocketLink = `${environment.chatSocket}`;
  private userId: number;
  private isOpenNewChat = false;
  private isOpenNewChatInWindow = false;
  private subscriptions: StompSubscription[] = [];

  public updateFriendsChatsStream$: Subject<FriendChatInfo> = new Subject<FriendChatInfo>();
  public updateDeleteMessageSubs: StompSubscription;

  constructor(
    private chatsService: ChatsService,
    private localStorageService: LocalStorageService,
    private jwt: JwtService,
    private titleService: Title
  ) {}
  public connect() {
    if (!this.socketState) {
      this.userId = this.localStorageService.getUserId();
      this.socket = new SockJS(this.backendSocketLink);
      this.stompClient = Stomp.over(() => this.socket);
      this.socketState = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
      this.stompClient.connect(
        {},
        () => {
          this.socketState.next(SocketClientState.CONNECTED);
          this.onConnected();
        },
        (error) => this.onError(error)
      );
      this.stompClient.reconnectDelay = 1000;
    }
  }

  connectSubs(): Observable<any> {
    return new Observable((observer) => {
      this.socketState.pipe(filter((state) => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.stompClient);
      });
    });
  }

  onMessage(topic: string) {
    return this.connectSubs().pipe(
      first(),
      switchMap(
        (client: CompatClient) =>
          new Observable<any>((observer) => {
            const subscription: StompSubscription = client.subscribe(topic, (message) => {
              observer.next(message);
            });
            return () => client.unsubscribe(subscription.id);
          })
      )
    );
  }

  private onConnected() {
    const isAdmin = this.jwt.getUserRole() === 'ROLE_UBS_EMPLOYEE' || this.jwt.getUserRole() === 'ROLE_ADMIN';

    const messagesSubs = this.onMessage(`/room/message/chat-messages${this.userId}`).subscribe((data) => {
      const newMessage: Message = JSON.parse(data.body);
      const messages = this.chatsService.chatsMessages[newMessage.roomId];
      const chat = this.chatsService.userChats?.find((el) => el.id === newMessage.roomId);
      if (chat && newMessage.senderId !== this.userId) {
        chat.amountUnreadMessages = 1;
        this.titleService.setTitle(`New message`);
      }

      if (messages) {
        messages.page.push(newMessage);
        this.chatsService.currentChatMessagesStream$.next(messages.page);
      }
    });

    const newParticipantSubs = this.onMessage('/message/new-participant').subscribe((participant) => {
      const newChatParticipant: Participant = JSON.parse(participant.body);
      this.chatsService.currentChat.participants.push(newChatParticipant);
    });

    const newChatSubs = this.onMessage(`/rooms/user/new-chats${this.userId}`).subscribe((newChat) => {
      const newUserChat = JSON.parse(newChat.body);

      if (!this.chatsService.isSupportChat) {
        const usersChats = [...this.chatsService.userChats, newUserChat];
        this.chatsService.userChatsStream$.next(usersChats);
        const idFriend = newUserChat.participants.find((user) => user.id !== this.userId)?.id;
        this.updateFriendsChatsStream$.next({
          friendId: idFriend,
          chatExists: true,
          chatId: newUserChat.id
        });
      }

      if (this.chatsService.isSupportChat && !isAdmin) {
        this.chatsService.locations.find((el) => el.tariffsId === newUserChat.tariffId).chat = newUserChat;
      }

      if (this.isOpenNewChat) {
        this.chatsService.openCurrentChat(newUserChat.id);
        this.isOpenNewChat = false;
      }
      if (this.isOpenNewChatInWindow) {
        this.chatsService.setCurrentChat(newUserChat);
      }
    });

    if (isAdmin) {
      const supportChatSubs = this.onMessage(`/user/${this.jwt.getEmailFromAccessToken()}/rooms/support`).subscribe((сhat) => {
        const userChat = JSON.parse(сhat.body);
        userChat.amountUnreadMessages = 1;
        const isNewChat = !this.chatsService.userChats.find((el) => el.id === userChat.id);
        if (isNewChat) {
          const usersChats = [...this.chatsService.userChats, userChat];
          this.chatsService.userChatsStream$.next(usersChats);
        } else {
          this.chatsService.userChats.find((el) => el.id === userChat.id).amountUnreadMessages = 1;
        }
        this.titleService.setTitle(`new chat`);
      });
    }
  }

  private onError(error) {
    console.log(error);
  }

  addParticipant(userId: number) {
    this.stompClient.send(`/app/${this.chatsService.currentChat.id}/participant`, {}, JSON.stringify(userId));
  }

  sendMessage(message: Message) {
    this.connectSubs()
      .pipe(first())
      .subscribe((client) => {
        client.send('/app/chat', {}, JSON.stringify(message));
        const currentChat = this.chatsService.currentChat;
        currentChat.lastMessage = message.content;
        currentChat.lastMessageDateTime = message.createDate;
      });
  }

  removeMessage(message: Message): void {
    this.connectSubs()
      .pipe(first())
      .subscribe((client) => {
        client.send('/app/chat/delete', {}, JSON.stringify(message));
      });
  }

  updateMessage(message: Message): void {
    this.connectSubs()
      .pipe(first())
      .subscribe((client) => {
        client.send('/app/chat/update', {}, JSON.stringify(message));
      });
  }

  likeMessage(message: MessagesLikeDto): void {
    this.connectSubs()
      .pipe(first())
      .subscribe((client) => {
        client.send('/app/chat/like', {}, JSON.stringify(message));
      });
  }

  createNewChat(ids, isOpen, isOpenInWindow?) {
    const key = this.chatsService.isSupportChat ? 'locationsIds' : 'participantsIds';
    const newChatInfo = {
      currentUserId: this.userId,
      [key]: ids
    };
    this.connectSubs()
      .pipe(first())
      .subscribe((client) => {
        client.send(`/app/chat/user`, {}, JSON.stringify(newChatInfo));
        this.isOpenNewChat = isOpen;
        this.isOpenNewChatInWindow = isOpenInWindow;
      });
  }

  subscribeToUpdateDeleteMessage(roomId: number): void {
    this.onMessage(`/room/${roomId}/queue/messages`).subscribe((data: IMessage) => {
      const message = JSON.parse(data.body);
      if (data.headers.update) {
        const updatedMessage = this.chatsService.currentChatMessages.find((el) => el.id === message.id);
        updatedMessage.content = message.content;
        updatedMessage.likes = message.likes;
        this.chatsService.currentChatMessagesStream$.next(this.chatsService.currentChatMessages);
        this.chatsService.messageToEdit$.next(null);
      }
      if (data.headers.delete) {
        const updatedMessages = this.chatsService.currentChatMessages.filter((el) => el.id !== message.id);
        this.chatsService.currentChatMessagesStream$.next(updatedMessages);
        const chatsMessages = this.chatsService.chatsMessages[roomId].page.filter((el) => el.id !== message.id);
        this.chatsService.chatsMessages[roomId].page = chatsMessages;
      }
    });
  }

  unsubscribeAll(): void {
    this.stompClient?.disconnect();
    this.socketState = null;
  }
}
