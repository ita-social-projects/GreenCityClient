import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatsService } from '../../service/chats/chats.service';
import { SocketService } from 'src/app/chat/service/socket/socket.service';
import { CHAT_ICONS } from '../../chat-icons';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Chat, LocationForChat } from '../../model/Chat.model';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Title } from '@angular/platform-browser';
import { UserService } from '@global-service/user/user.service';
import { Subject } from 'rxjs';
import { FriendModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  chatIcons = CHAT_ICONS;
  searchField = '';
  searchFieldControl = new FormControl();
  isUbsAdmin: boolean;
  @Input() isPopup: boolean;
  @Output() createNewMessageWindow: EventEmitter<Chat> = new EventEmitter<Chat>();

  constructor(
    public chatService: ChatsService,
    private socketService: SocketService,
    private jwt: JwtService,
    private titleService: Title,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isUbsAdmin = this.jwt.getUserRole() === 'ROLE_UBS_EMPLOYEE';
    if (!this.chatService.isSupportChat) {
      this.searchFieldControl.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((newValue) => {
        this.searchField = newValue;
        this.chatService.searchFriends(newValue);
      });
    }

    if (this.chatService.isSupportChat && this.isUbsAdmin) {
      this.chatService.currentChatStream$.pipe(takeUntil(this.destroy$)).subscribe((chat) => {
        const isAdminParticipant = chat?.participants?.some((el) => el.id === this.userService.userId);
        this.chatService.isAdminParticipant$.next(isAdminParticipant);
      });
    }
  }

  messageDateTreat(date: string): string {
    const messageDate = new Date(date);
    const today = new Date();
    if (messageDate.getFullYear() !== today.getFullYear()) {
      return 'dd/MM/yyyy';
    }
    const isToday = messageDate.getDate() === today.getDate() && messageDate.getMonth() === today.getMonth();
    return isToday ? 'HH:mm' : 'dd/MM';
  }

  checkChat(chatTarget: FriendModel | LocationForChat): void {
    if (this.isUbsAdmin) {
      return;
    }

    const userChat = this.chatService.isSupportChat
      ? (chatTarget as LocationForChat).chat
      : this.chatService.userChats.find((chat) => chat?.id === (chatTarget as FriendModel).friendsChatDto?.chatId);

    const idForNewChat = this.chatService.isSupportChat ? (chatTarget as LocationForChat).tariffsId : chatTarget.id;
    userChat ? this.chatService.setCurrentChat(userChat) : this.socketService.createNewChat(idForNewChat, false, true);

    this.createNewMessageWindow.emit();
  }

  onScroll(): void {
    const pageData = this.chatService.currentChatPageData$.getValue();
    if (pageData.totalPages > pageData.currentPage + 1) {
      this.chatService.getAllSupportChats(pageData.currentPage + 1);
    }
  }

  openNewMessageWindow(chat: Chat) {
    chat.amountUnreadMessages = null;
    this.titleService.setTitle('Pick Up City');
    this.chatService.setCurrentChat(chat);
    this.createNewMessageWindow.emit(chat);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
