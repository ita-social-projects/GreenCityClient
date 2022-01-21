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
  private userId: string;

  constructor(private chatsService: ChatsService, private localStorageService: LocalStorageService) {}

  public connect() {
    this.userId = this.localStorageService.getUserId().toString();
    this.socket = new SockJS(this.backendSocketLink);
    this.stompClient = Stomp.over(() => this.socket);
    this.stompClient.connect(
      {},
      () => this.onConnected(),
      (error) => this.onError(error)
    );
  }

  private onConnected() {
    this.stompClient.subscribe(
      '/room/message/chat-messages',
      (data: IMessage) => {
        // TODO bad logic, you might not be sitting in chat where message landed FIXIT
        const newMessage: Message = JSON.parse(data.body);
        console.log(newMessage);
        const messages = this.chatsService.chatsMessages[newMessage.roomId];
        if (messages) {
          messages.page.push(newMessage);
          this.chatsService.currentChatMessagesStream$.next(messages.page);
        }
      },
      { id: this.userId }
    );
    this.stompClient.subscribe(
      '/message/new-participant',
      (participant) => {
        console.log(participant);
        const newChatParticipant: User = JSON.parse(participant.body);
        this.chatsService.currentChat.participants.push(newChatParticipant);
      },
      { id: this.userId }
    );
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
      currentUserId: 22,
      participantsIds: 18
    };
    this.stompClient.send(`/app/chat/user`, {}, JSON.stringify(newChatInfo));
  }
}
