import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { environment } from '@environment/environment';
import { CompatClient, IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import { Message, MessagesLikeDto } from '../../model/Message.model';
import { ChatsService } from '../chats/chats.service';
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
  private subscriptions: StompSubscription[] = [];

  updateFriendsChatsStream$: Subject<FriendChatInfo> = new Subject<FriendChatInfo>();
  updateDeleteMessageSubs: StompSubscription;

  constructor(
    private chatsService: ChatsService,
    private localStorageService: LocalStorageService,
    private jwt: JwtService,
    private titleService: Title
  ) {}
  connect() {
    this.userId = this.localStorageService.getUserId();
    this.socket = new SockJS(this.backendSocketLink);
    this.stompClient = Stomp.over(() => this.socket);
    this.stompClient.connect(
      {},
      () => {
        if (this.stompClient.connected) {
          this.onConnected();
        }
      },
      (error) => this.onError(error)
    );
    this.stompClient.reconnectDelay = 1000;
  }

  private onConnected() {
    const isAdmin = this.jwt.getUserRole() === 'ROLE_UBS_EMPLOYEE';

    const messagesSubs = this.stompClient.subscribe(`/room/message/chat-messages${this.userId}`, (data: IMessage) => {
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
    this.subscriptions.push(messagesSubs);

    const newParticipantSubs = this.stompClient.subscribe('/message/new-participant', (participant) => {
      const newChatParticipant: Participant = JSON.parse(participant.body);
      this.chatsService.currentChat.participants.push(newChatParticipant);
    });
    this.subscriptions.push(newParticipantSubs);

    const newChatSubs = this.stompClient.subscribe(`/rooms/user/new-chats${this.userId}`, (newChat) => {
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
    this.subscriptions.push(newChatSubs);

    if (isAdmin) {
      const supportChatSubs = this.stompClient.subscribe(`/user/${this.jwt.getEmailFromAccessToken()}/rooms/support`, (сhat) => {
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
      this.subscriptions.push(supportChatSubs);
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

  removeMessage(message: Message): void {
    this.stompClient.send('/app/chat/delete', {}, JSON.stringify(message));
  }

  updateMessage(message: Message): void {
    this.stompClient.send('/app/chat/update', {}, JSON.stringify(message));
  }

  likeMessage(message: MessagesLikeDto): void {
    this.stompClient.send('/app/chat/like', {}, JSON.stringify(message));
  }

  createNewChat(ids, isOpen, isOpenInWindow?): void {
    const key = this.chatsService.isSupportChat ? 'tariffId' : 'participantId';
    const newChatInfo = {
      currentUserId: this.userId,
      [key]: ids
    };
    this.stompClient.send(`/app/chat/user`, {}, JSON.stringify(newChatInfo));
    this.isOpenNewChat = isOpen;
    this.isOpenNewChatInWindow = isOpenInWindow;
  }

  subscribeToUpdateDeleteMessage(roomId: number): void {
    this.updateDeleteMessageSubs = this.stompClient.subscribe(`/room/${roomId}/queue/messages`, (data: IMessage) => {
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
      }
    });
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach((subs) => {
      if (subs) {
        subs.unsubscribe();
      }
    });
  }
}
