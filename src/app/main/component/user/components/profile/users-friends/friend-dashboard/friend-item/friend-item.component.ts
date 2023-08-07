import { MatDialog } from '@angular/material/dialog';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendModel } from '@global-user/models/friend.model';
import { SocketService } from 'src/app/chat/service/socket/socket.service';
import { ChatsService } from 'src/app/chat/service/chats/chats.service';
import { ChatModalComponent } from 'src/app/chat/component/chat-modal/chat-modal.component';
import { MaxTextLengthPipe } from 'src/app/ubs/ubs-admin/components/shared/max-text-length/max-text-length.pipe';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss'],
  providers: [MaxTextLengthPipe]
})
export class FriendItemComponent implements OnInit {
  public userId: number;
  private dialogConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'custom-dialog-container',
    height: '80vh'
  };
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
    private maxTextLengthPipe: MaxTextLengthPipe
  ) {
    this.userId = +this.route.snapshot.params.userId;
  }

  ngOnInit() {
    this.socketService.updateFriendsChatsStream$.subscribe((chatInfo) => {
      if (this.friend.id === chatInfo.friendId) {
        this.friend.chatId = chatInfo.chatId;
      }
    });
    this.friend.city = this.maxTextLengthPipe.transform(this.friend.city);
  }

  friendEvent(): void {
    this.friendEventEmit.emit(this.friend.id);
  }

  declineFriend(): void {
    this.declineEvent.emit(this.friend.id);
  }

  private toUsersInfo(): void {
    if (this.userId) {
      return;
    }
    this.router.navigate([this.friend.name, this.friend.id], { relativeTo: this.route, queryParams: { tab: 'All firends', index: 3 } });
  }

  private showMutualFriends(): void {
    this.router.navigate([this.friend.name, this.friend.id], { relativeTo: this.route, queryParams: { tab: 'Mutual friends', index: 4 } });
  }

  public clickHandler(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      this.checkButtons(target.id);
    } else if (target.tagName === 'SPAN' && !this.userId) {
      this.showMutualFriends();
    } else {
      this.toUsersInfo();
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
