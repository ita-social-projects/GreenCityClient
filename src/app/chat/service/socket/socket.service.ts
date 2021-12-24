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

  constructor(private chatsService: ChatsService) {}

  public connect() {
    this.socket = new SockJS(this.backendSocketLink);
    this.stompClient = Stomp.over(() => this.socket);
    this.stompClient.connect(
      {},
      () => this.onConnected(),
      (error) => this.onError(error)
    );
  }

  private onConnected() {
    this.stompClient.subscribe('/message/chat-messages', (data: IMessage) => {
      // TODO bad logic, you might not be sitting in chat where message landed FIXIT
      const newMessage: Message = JSON.parse(data.body);
      const messages = this.chatsService.chatsMessages[newMessage.chatId];
      if (messages) {
        messages.push(newMessage);
        this.chatsService.currentChatMessagesStream$.next(messages);
      }
    });
    this.stompClient.subscribe('/message/new-participant', (participant) => {
      console.log(participant);
      const newChatParticipant: User = JSON.parse(participant.body);
      this.chatsService.currentChat.participants.push(newChatParticipant);
    });
  }

  private onError(error) {
    console.log(error);
  }

  addParticipant(userId: number) {
    this.stompClient.send(`/app/${this.chatsService.currentChat.id}/participant`, {}, JSON.stringify(userId));
  }

  sendMessage(message: Message) {
    this.stompClient.send('/app/addMessage', {}, JSON.stringify(message));
    const currentChat = this.chatsService.currentChat;
    currentChat.lastMessage = message.messageText;
    currentChat.lastMessageDate = message.messageDate;
    this.chatsService.updateChat(currentChat);
  }
}
