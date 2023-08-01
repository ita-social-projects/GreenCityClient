import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from '@environment/environment';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { Message } from '../../model/Message.model';
import { ChatsService } from '../chats/chats.service';
import { User } from '../../model/User.model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { FriendChatInfo } from '../../model/Chat.model';

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
      const newMessage: Message = JSON.parse(data.body);
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
      const newUserChat = JSON.parse(newChat.body);
      const usersChats = [...this.chatsService.userChats, newUserChat];
      this.chatsService.userChatsStream$.next(usersChats);
      const idFriend = newUserChat.participants.find((user) => user.id !== this.userId).id;
      this.updateFriendsChatsStream$.next({
        friendId: idFriend,
        chatId: newUserChat.id
      });
      if (this.isOpenNewChat) {
        this.chatsService.openCurrentChat(newUserChat.id);
        this.isOpenNewChat = false;
      }
      if (this.isOpenNewChatInWindow) {
        this.chatsService.setCurrentChat(newUserChat);
      }
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
  }

  createNewChat(participantsId, isOpen, isOpenInWindow?) {
    const newChatInfo = {
      currentUserId: this.userId,
      participantsIds: participantsId
    };
    this.stompClient.send(`/app/chat/user`, {}, JSON.stringify(newChatInfo));
    this.isOpenNewChat = isOpen;
    this.isOpenNewChatInWindow = isOpenInWindow;
  }
}
