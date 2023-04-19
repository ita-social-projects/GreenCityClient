import { MatDialog } from '@angular/material/dialog';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendModel } from '@global-user/models/friend.model';
import { SocketService } from 'src/app/chat/service/socket/socket.service';
import { ChatsService } from 'src/app/chat/service/chats/chats.service';
import { ChatModalComponent } from 'src/app/chat/component/chat-modal/chat-modal.component';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
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
  @Input() btnName: string;
  @Output() friendEventEmit = new EventEmitter<number>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private dialog: MatDialog,
    private chatsService: ChatsService
  ) {
    this.userId = +this.route.snapshot.params.userId;
  }

  ngOnInit() {
    this.socketService.updateFriendsChatsStream$.subscribe((chatInfo) => {
      if (this.friend.id === chatInfo.friendId) {
        this.friend.friendsChatDto.chatExists = chatInfo.chatExists;
        this.friend.friendsChatDto.chatId = chatInfo.chatId;
      }
    });
  }

  public friendEvent(id: number): void {
    this.friendEventEmit.emit(id);
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
      this.friendEvent(this.friend.id);
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
    this.friend.friendsChatDto.chatExists = true;
  }

  private onOpenChat() {
    this.dialog.closeAll();
    this.dialog.open(ChatModalComponent, this.dialogConfig);
    this.chatsService.openCurrentChat(this.friend.friendsChatDto.chatId);
  }
}
