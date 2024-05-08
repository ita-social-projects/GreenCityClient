import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from '@environment/environment';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { Message } from '../../model/Message.model';
import { ChatsService } from '../chats/chats.service';
import { User } from '../../model/User.model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { FriendChatInfo, Participant } from '../../model/Chat.model';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: WebSocket;
  private stompClient: CompatClient;
  private backendSocketLink = `${environment.chatSocket}`;
  private userId: number;
  private isOpenNewChat = false;
  private isOpenNewChatInWindow = false;

  public updateFriendsChatsStream$: Subject<FriendChatInfo> = new Subject<FriendChatInfo>();

  constructor(
    private chatsService: ChatsService,
    private localStorageService: LocalStorageService,
    private jwt: JwtService,
    private titleService: Title
  ) {}
  public connect() {
    this.userId = this.localStorageService.getUserId();
    this.socket = new SockJS(this.backendSocketLink);
    this.stompClient = Stomp.over(() => this.socket);
    this.stompClient.connect(
      {},
      () => {
        this.onConnected();
      },
      (error) => this.onError(error)
    );
  }

  private onConnected() {
    const isSupportChat = !this.chatsService.isSupportChat$.getValue();
    const isAdmin = this.jwt.getUserRole() === 'ROLE_UBS_EMPLOYEE' || this.jwt.getUserRole() === 'ROLE_ADMIN';
    this.stompClient.subscribe(`/room/message/chat-messages${this.userId}`, (data: IMessage) => {
      const newMessage: Message = JSON.parse(data.body);
      const messages = this.chatsService.chatsMessages[newMessage.roomId];
      if (messages) {
        messages.page.push(newMessage);
        this.chatsService.currentChatMessagesStream$.next(messages.page);
      }
    });

    this.stompClient.subscribe('/message/new-participant', (participant) => {
      const newChatParticipant: Participant = JSON.parse(participant.body);
      this.chatsService.currentChat.participants.push(newChatParticipant);
    });

    this.stompClient.subscribe(`/rooms/user/new-chats${this.userId}`, (newChat) => {
      const newUserChat = JSON.parse(newChat.body);
      const usersChats = [...this.chatsService.userChats, newUserChat];
      this.chatsService.userChatsStream$.next(usersChats);
      if (!isSupportChat) {
        const idFriend = newUserChat.participants.find((user) => user.id !== this.userId).id;
        this.updateFriendsChatsStream$.next({
          friendId: idFriend,
          chatExists: true,
          chatId: newUserChat.id
        });
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
      this.stompClient.subscribe(`/user/${this.jwt.getEmailFromAccessToken()}/rooms/support`, (сhat) => {
        const userChat = JSON.parse(сhat.body);
        userChat.amountUnreadMessages = 1;
        const isNewChat = !this.chatsService.userChats.find((el) => {
          el.id === userChat.id;
        });
        if (isNewChat) {
          const usersChats = [...this.chatsService.userChats, userChat];
          this.chatsService.userChatsStream$.next(usersChats);
        } else {
          this.chatsService.userChats.find((el) => {
            el.id === userChat.id;
          }).amountUnreadMessages = 1;
        }
        console.log('message for admin!!!', userChat);
        this.titleService.setTitle(`new message`);
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
    this.stompClient.send('/app/chat', {}, JSON.stringify(message));
    const currentChat = this.chatsService.currentChat;
    currentChat.lastMessage = message.content;
    currentChat.lastMessageDateTime = message.createDate;
  }

  createNewChat(ids, isOpen, isOpenInWindow?) {
    const key = !this.chatsService.isSupportChat$.getValue() ? 'participantsIds' : 'locationsIds';
    const newChatInfo = {
      currentUserId: this.userId,
      [key]: ids
    };
    this.stompClient.send(`/app/chat/user`, {}, JSON.stringify(newChatInfo));
    this.isOpenNewChat = isOpen;
    this.isOpenNewChatInWindow = isOpenInWindow;
  }
}
