import { FriendModel } from '@global-user/models/friend.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatsService } from '../../service/chats/chats.service';
import { SocketService } from 'src/app/chat/service/socket/socket.service';
import { CHAT_ICONS } from '../../chat-icons';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Chat } from '../../model/Chat.model';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Title } from '@angular/platform-browser';
import { Role } from '@global-models/user/roles.model';

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
  public isAdmin: boolean;
  @Input() isPopup: boolean;
  @Output() createNewMessageWindow: EventEmitter<Chat> = new EventEmitter<Chat>();

  constructor(
    public chatService: ChatsService,
    private socketService: SocketService,
    private jwt: JwtService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.searchFieldControl.valueChanges.pipe(debounceTime(500)).subscribe((newValue) => {
      this.searchField = newValue;
      this.chatService.searchFriends(newValue);
    });
    this.chatService.isSupportChat$.subscribe((value) => {
      this.isSupportChat = value;
    });

    this.isAdmin = this.jwt.getUserRole() === Role.UBS_EMPLOYEE || this.jwt.getUserRole() === Role.ADMIN;
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
    chat.amountUnreadMessages = null;
    this.titleService.setTitle('Pick Up City');
    this.chatService.setCurrentChat(chat);
    this.createNewMessageWindow.emit(chat);
  }
}
