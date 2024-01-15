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
import { Store } from '@ngrx/store';
import { AcceptRequest, DeclineRequest, DeleteFriend } from 'src/app/store/actions/friends.actions';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { WarningPopUpComponent } from '@shared/components';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit {
  private destroy$ = new Subject();
  public currentLang: string;
  public userId: number;
  private dialogConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true
  };
  private chatDialogConfig = {
    ...this.dialogConfig,
    panelClass: 'custom-dialog-container',
    height: '80vh'
  };
  private confirmDialogConfig = {
    ...this.dialogConfig,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: `profile.friends.unfriend-popup.title`,
      popupConfirm: `profile.friends.unfriend-popup.confirm`,
      popupCancel: `profile.friends.unfriend-popup.cancel`
    }
  };
  public currentUserId: number;

  @Input() friend: FriendModel;
  @Output() friendDelete = new EventEmitter<number>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private dialog: MatDialog,
    private chatsService: ChatsService,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private store: Store,
    private userFriendsService: UserFriendsService,
    private snackBar: MatSnackBarComponent
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
  public addFriend(id: number): void {
    this.userFriendsService
      .addFriend(this.friend.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.snackBar.openSnackBar('addFriend');
          this.friend.friendStatus = 'REQUEST';
          this.friend.requesterId = this.currentUserId;
        },
        (err) => console.error(err.message)
      );
  }

  public unsendFriendRequest(id: number): void {
    this.userFriendsService
      .unsendFriendRequest(id)
      .pipe(take(1))
      .subscribe(() => {
        this.friend.friendStatus = null;
        this.friend.requesterId = null;
      });
  }

  public openConfirmPopup(): void {
    const dialogRef = this.dialog.open(WarningPopUpComponent, this.confirmDialogConfig);

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirm) => {
        if (confirm) {
          this.store.dispatch(DeleteFriend({ id: this.friend.id }));
          this.friendDelete.emit(this.friend.id);
        }
      });
  }

  private checkButtons(idName: string) {
    switch (idName) {
      case 'addFriend':
        this.addFriend(this.friend.id);
        break;
      case 'cancelRequest':
        this.unsendFriendRequest(this.friend.id);
        break;
      case 'deleteFriend':
        this.openConfirmPopup();
        break;
      case 'declineRequest':
        this.store.dispatch(DeclineRequest({ id: this.friend.id }));
        break;
      case 'acceptRequest':
        this.store.dispatch(AcceptRequest({ id: this.friend.id }));
        break;
      case 'createChatButton':
        this.onCreateChat();
        break;
      case 'openChatButton':
        this.onOpenChat();
        break;
      default:
        break;
    }
  }

  public getFriendCity(locationDto: UserLocationDto): string {
    return this.langService.getLangValue(locationDto?.cityUa, locationDto?.cityEn) as string;
  }

  private onCreateChat() {
    this.socketService.createNewChat(this.friend.id, true);
    this.dialog.closeAll();
    this.dialog.open(ChatModalComponent, this.chatDialogConfig);
  }

  private onOpenChat() {
    this.dialog.closeAll();
    this.dialog.open(ChatModalComponent, this.chatDialogConfig);
    this.chatsService.openCurrentChat(this.friend.chatId);
  }

  isAbleToAdd(): boolean {
    return (!this.friend.friendStatus || this.friend.friendStatus === 'REJECTED') && this.friend.id !== this.currentUserId;
  }

  isCurrentUserRequested(): boolean {
    return this.friend.friendStatus === 'REQUEST' && this.friend.requesterId === this.currentUserId;
  }

  isFriendRequest(): boolean {
    return this.friend.friendStatus === 'REQUEST' && this.friend.requesterId === this.friend.id;
  }
}
