import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat, ChatDto } from '../../model/Chat.model';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message, MessagesToSave } from '../../model/Message.model';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { Messages } from './../../model/Message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  userChatsStream$: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  currentChatsStream$: BehaviorSubject<Chat> = new BehaviorSubject<Chat>(null);
  currentChatPageData$: BehaviorSubject<ChatDto> = new BehaviorSubject<ChatDto>(null);
  currentChatMessagesStream$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  searchedFriendsStream$: BehaviorSubject<FriendModel[]> = new BehaviorSubject<FriendModel[]>([]);
  locationChats$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  isChatUpdateStream$: Subject<boolean> = new Subject<boolean>();
  chatsMessages: { [key: string]: MessagesToSave } = {};
  private messagesIsLoading = false;
  isSupportChat$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAdminParticipant$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  supportChatPageSize = 10;
  messagesPageSize = 20;

  constructor(private httpClient: HttpClient) {}

  get userChats() {
    return this.userChatsStream$.getValue();
  }

  get locationChats() {
    return this.locationChats$.getValue();
  }

  get currentChat() {
    return this.currentChatsStream$.getValue();
  }

  get currentChatMessages() {
    return this.currentChatMessagesStream$.getValue();
  }

  get isSupportChat() {
    return this.isSupportChat$.getValue();
  }

  getAllUserChats(userId: number): void {
    this.httpClient.get<Chat[]>(`${environment.backendChatLink}chat/`).subscribe((chats: Chat[]) => {
      this.userChatsStream$.next(chats);
    });
  }

  getAllSupportChats(page = 0, pageSize = this.supportChatPageSize): void {
    this.httpClient
      .get<ChatDto>(`${environment.backendChatLink}chat/chats/active?page=${page}&size=${pageSize}`)
      .subscribe((chats: ChatDto) => {
        const previousChats = this.userChatsStream$.getValue();
        const newChats = chats.page.filter((chat) => !previousChats.find((el) => el.id === chat.id));
        const updatedChats = [...previousChats, ...newChats];
        this.currentChatPageData$.next(chats);
        this.userChatsStream$.next(updatedChats);
      });
  }

  public updateChat(chat: Chat): void {
    this.httpClient.put<Chat>(`${environment.backendChatLink}chat/`, chat).subscribe();
  }

  public getAllChatMessages(chatId: number, page: number, size = this.messagesPageSize): Observable<Messages> {
    return this.httpClient.get<Messages>(`${environment.backendChatLink}chat/messages/${chatId}?size=${size}&page=${page}`);
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
      this.currentChatMessagesStream$.next(this.chatsMessages[chat.id].page);
      return;
    }

    this.messagesIsLoading = true;
    this.getAllChatMessages(chat.id, 0).subscribe((messages: Messages) => {
      this.currentChatsStream$.next(chat);
      this.currentChatMessagesStream$.next(messages.page);
      this.chatsMessages[chat.id] = messages;
      this.chatsMessages[chat.id].newMessagesAmount = 0;
      this.messagesIsLoading = false;
    });
  }

  public updateChatMessages(id: number, page: number) {
    this.messagesIsLoading = true;
    const numberOfVisibleMessages = this.chatsMessages[id].page.length;
    const pageToLoad = Math.floor(numberOfVisibleMessages / this.messagesPageSize);

    this.getAllChatMessages(id, pageToLoad).subscribe((messages: Messages) => {
      const filtredMessages = messages.page.filter((message) => {
        const isMessageAlreadyVisible = this.chatsMessages[id].page.some((el) => el.id === message.id);
        return !isMessageAlreadyVisible;
      });
      this.chatsMessages[id].page.unshift(...filtredMessages);
      this.isChatUpdateStream$.next(true);
      this.messagesIsLoading = false;
    });
  }

  public openCurrentChat(chatId: number) {
    const currentChat = this.userChats.find((chat) => chat.id === chatId);
    this.setCurrentChat(currentChat);
  }

  public searchFriends(name: string) {
    this.httpClient
      .get(`${environment.backendUserLink}user/findUserByName?name=${name}&page=0&size=5`)
      .subscribe((data: FriendArrayModel) => {
        this.searchedFriendsStream$.next(data.page);
      });
  }

  public getLocationsChats(userId: number) {
    this.httpClient.get(`${environment.backendChatLink}chat/locations/${userId}`).subscribe((el) => {
      this.locationChats$.next(el);
    });
  }

  public addAdminToChat(adminId: number) {
    this.httpClient.post(`${environment.backendChatLink}chat/admin/${adminId}/${this.currentChat.id}`, {}).subscribe(() => {
      const newParticipant = {
        id: adminId,
        name: '',
        email: '',
        profilePicture: null,
        userStatus: '',
        rooms: null,
        role: ''
      };
      this.currentChat.participants.push(newParticipant);
      this.isAdminParticipant$.next(true);
      const chat = this.userChats.find((el) => el.id === this.currentChat.id);
      chat.participants.push(newParticipant);
    });
  }
}
