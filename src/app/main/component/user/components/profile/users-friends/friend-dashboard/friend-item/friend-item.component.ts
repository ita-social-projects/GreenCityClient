import { MatDialog } from '@angular/material/dialog';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendModel, UserDashboardTab } from '@global-user/models/friend.model';
import { SocketService } from 'src/app/chat/service/socket/socket.service';
import { ChatsService } from 'src/app/chat/service/chats/chats.service';
import { ChatModalComponent } from 'src/app/chat/component/chat-modal/chat-modal.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { UserLocationDto } from '@global-user/models/edit-profile.model';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit {
  public currentLang: string;
  public userId: number;
  private dialogConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'custom-dialog-container',
    height: '80vh'
  };
  private currentUserId: number;

  @Input() friend: FriendModel;
  @Input() primaryBtnName: string;
  @Input() secondaryBtnName: string;
  @Input() isFriendRequest: boolean;

  @Output() friendEventEmit = new EventEmitter<number>();
  @Output() declineEvent = new EventEmitter<number>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private dialog: MatDialog,
    private chatsService: ChatsService,
    private localStorageService: LocalStorageService,
    private langService: LanguageService
  ) {
    this.userId = +this.route.snapshot.params.userId;
  }

  ngOnInit() {
    this.socketService.updateFriendsChatsStream$.subscribe((chatInfo) => {
      if (this.friend.id === chatInfo.friendId) {
        this.friend.chatId = chatInfo.chatId;
      }
    });
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => {
      this.currentUserId = id;
    });
    this.getLangChange();
  }

  friendEvent(): void {
    this.friendEventEmit.emit(this.friend.id);
  }

  declineFriend(): void {
    this.declineEvent.emit(this.friend.id);
  }

  private getLangChange(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }

  private toUsersInfo(tab = UserDashboardTab.allHabits): void {
    if (this.userId) {
      this.router.navigate(['profile', this.currentUserId, 'users', this.friend.name, this.friend.id], {
        queryParams: { tab }
      });
    }

    if (!this.userId) {
      this.router.navigate([this.friend.name, this.friend.id], { relativeTo: this.route, queryParams: { tab } });
    }
  }

  public clickHandler(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      this.checkButtons(target.id);
    } else {
      target.classList.contains('friend-mutual-link') ? this.toUsersInfo(UserDashboardTab.mutualFriends) : this.toUsersInfo();
    }
  }

  private checkButtons(idName: string) {
    if (idName === 'addButton') {
      this.friendEvent();
    } else if (idName === 'createChatButton') {
      this.onCreateChat();
    } else if (idName === 'openChatButton') {
      this.onOpenChat();
    }
  }

  public getFriendCity(locationDto: UserLocationDto): string {
    return this.langService.getLangValue(locationDto?.cityUa, locationDto?.cityEn) as string;
  }

  private onCreateChat() {
    this.socketService.createNewChat(this.friend.id, true);
    this.dialog.closeAll();
    this.dialog.open(ChatModalComponent, this.dialogConfig);
  }

  private onOpenChat() {
    this.dialog.closeAll();
    this.dialog.open(ChatModalComponent, this.dialogConfig);
    this.chatsService.openCurrentChat(this.friend.chatId);
  }
}
