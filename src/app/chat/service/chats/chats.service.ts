import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../../model/Chat.model';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../model/Message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  public userChatsStream$: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  public currentChatsStream$: BehaviorSubject<Chat> = new BehaviorSubject<Chat>(null);
  public currentChatMessagesStream$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  public chatsMessages: Object = {};
  private messagesIsLoading = false;

  constructor(private httpClient: HttpClient) {}

  public get userChats() {
    return this.userChatsStream$.getValue();
  }

  public get currentChat() {
    return this.currentChatsStream$.getValue();
  }

  public get currentChatMessages() {
    return this.currentChatMessagesStream$.getValue();
  }

  public getAllUserChats(userId: number): void {
    this.httpClient.get<Chat[]>(`${environment.backendChatLink}chat/`).subscribe((chats: Chat[]) => {
      console.log(chats);
      this.userChatsStream$.next(chats);
    });
  }

  public updateChat(chat: Chat): void {
    this.httpClient.put<Chat>(`${environment.backendChatLink}chat/`, chat).subscribe();
  }

  public getAllChatMessages(chatId: number): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${environment.backendChatLink}chat/messages/${chatId}`);
  }

  public setCurrentChat(chat: Chat | null): void {
    // If messages are already loading.
    if (this.messagesIsLoading) {
      return;
    }
    // If current chat needs to be null
    if (!chat) {
      this.currentChatsStream$.next(chat);
      return;
    }
    // If messages for this chat is already loaded.
    if (this.chatsMessages[chat.id]) {
      this.currentChatsStream$.next(chat);
      this.currentChatMessagesStream$.next(this.chatsMessages[chat.id]);
      return;
    }

    this.messagesIsLoading = true;
    this.getAllChatMessages(chat.id).subscribe((messages: Message[]) => {
      console.log('Messages', messages);
      this.currentChatsStream$.next(chat);
      this.currentChatMessagesStream$.next(messages);
      this.chatsMessages[chat.id] = messages;
      this.messagesIsLoading = false;
    });
  }
}
