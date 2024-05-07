import { FriendModel } from '@global-user/models/friend.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatsService } from '../../service/chats/chats.service';
import { SocketService } from 'src/app/chat/service/socket/socket.service';
import { CHAT_ICONS } from '../../chat-icons';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Chat } from '../../model/Chat.model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { JwtService } from '@global-service/jwt/jwt.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements OnInit {
  public chatIcons = CHAT_ICONS;
  public searchField = '';
  public searchFieldControl = new FormControl();
  public isSupportChat: boolean;
  public userId: number;
  public isAdmin: boolean;
  @Input() isPopup: boolean;
  @Output() createNewMessageWindow: EventEmitter<Chat> = new EventEmitter<Chat>();

  constructor(
    public chatService: ChatsService,
    private socketService: SocketService,
    private localeStorageService: LocalStorageService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    console.log('isAdmin', this.isAdmin);
    this.searchFieldControl.valueChanges.pipe(debounceTime(500)).subscribe((newValue) => {
      this.searchField = newValue;
      this.chatService.searchFriends(newValue);
    });
    this.isAdmin = this.jwtService.getUserRole() === 'ROLE_UBS_EMPLOYEE' || this.jwtService.getUserRole() === 'ROLE_ADMIN';
    console.log('isAdmin', this.isAdmin);
    this.userId = this.localeStorageService.getUserId();

    this.chatService.isSupportChat$.subscribe((value) => {
      this.isSupportChat = value;
      if (this.isSupportChat && !this.isAdmin) {
        this.chatService.getLocationsChats(this.userId);
      }
    });
  }

  public messageDateTreat(date: Date): string {
    const messageDate = new Date(date);
    const today = new Date();
    if (messageDate.getFullYear() !== today.getFullYear()) {
      return 'dd/MM/yyyy';
    }
    const isToday = messageDate.getDate() === today.getDate() && messageDate.getMonth() === today.getMonth();
    return isToday ? 'HH:mm' : 'dd/MM';
  }

  public checkChat(chatTarget: any) {
    if (this.isAdmin) {
      return;
    }
    if (!this.isSupportChat && chatTarget.friendsChatDto?.chatExists) {
      const userChat = this.chatService.userChats.find((chat) => chat.id === chatTarget.friendsChatDto.chatId);
      this.chatService.setCurrentChat(userChat);
      this.createNewMessageWindow.emit();
    } else {
      this.socketService.createNewChat(chatTarget.id, false, true);
      this.createNewMessageWindow.emit();
    }
  }

  openNewMessageWindow(chat: Chat) {
    this.chatService.setCurrentChat(chat);
    this.createNewMessageWindow.emit(chat);
  }
}
