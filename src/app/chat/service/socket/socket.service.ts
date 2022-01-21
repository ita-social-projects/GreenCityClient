import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from '@environment/environment';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { Message } from '../../model/Message.model';
import { ChatsService } from '../chats/chats.service';
import { User } from '../../model/User.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: WebSocket;
  private stompClient: CompatClient;
  private backendSocketLink = `${environment.socket}`;
  private userId: number;

  constructor(private chatsService: ChatsService, private localStorageService: LocalStorageService) {}

  public connect() {
    this.userId = this.localStorageService.getUserId();
    this.socket = new SockJS(this.backendSocketLink);
    this.stompClient = Stomp.over(() => this.socket);
    this.stompClient.connect(
      {},
      () => this.onConnected(),
      (error) => this.onError(error)
    );
  }

  private onConnected() {
    this.stompClient.subscribe(`/room/message/chat-messages${this.userId}`, (data: IMessage) => {
      console.log(data);
      // TODO bad logic, you might not be sitting in chat where message landed FIXIT
      const newMessage: Message = JSON.parse(data.body);
      console.log(newMessage);
      const messages = this.chatsService.chatsMessages[newMessage.roomId];
      if (messages) {
        messages.page.push(newMessage);
        this.chatsService.currentChatMessagesStream$.next(messages.page);
      }
    });
    this.stompClient.subscribe('/message/new-participant', (participant) => {
      console.log(participant);
      const newChatParticipant: User = JSON.parse(participant.body);
      this.chatsService.currentChat.participants.push(newChatParticipant);
    });
    this.stompClient.subscribe(`/rooms/user/new-chats${this.userId}`, (newChat) => {
      console.log(newChat);
    });
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
    currentChat.lastMessageDate = message.createDate;
    // this.chatsService.updateChat(currentChat);
  }

  createNewChat() {
    const newChatInfo = {
      currentUserId: this.userId,
      participantsIds: 1
    };
    this.stompClient.send(`/app/chat/user`, {}, JSON.stringify(newChatInfo));
  }
}
