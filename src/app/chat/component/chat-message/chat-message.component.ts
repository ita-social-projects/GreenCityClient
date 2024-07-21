import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FileType, Message } from '../../model/Message.model';
import { CHAT_ICONS } from '../../chat-icons';
import { UserService } from '@global-service/user/user.service';
import { ChatsService } from '../../service/chats/chats.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningPopUpComponent } from '@shared/components';
import { SocketService } from '../../service/socket/socket.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  chatIcons = CHAT_ICONS;
  isBeingEdited: boolean;
  fileTypes = FileType;
  private dialogConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'chat.delete-message-question',
      popupConfirm: 'chat.delete-message-confirm',
      popupCancel: 'chat.delete-message-cancel'
    }
  };

  @Input() message: Message;

  constructor(
    public userService: UserService,
    public chatsService: ChatsService,
    public dialog: MatDialog,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.chatsService.messageToEdit$.pipe(takeUntil(this.destroy$)).subscribe((message) => {
      this.isBeingEdited = message?.id === this.message.id;
    });
  }

  openDeleteMessageDialog() {
    this.isBeingEdited = false;
    this.chatsService.messageToEdit$.next(null);
    this.dialog
      .open(WarningPopUpComponent, this.dialogConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          const { id, roomId, senderId, content } = this.message;
          this.socketService.removeMessage({ id, roomId, senderId, content });
        }
      });
  }

  activateEditMode(): void {
    this.isBeingEdited = true;
    this.chatsService.messageToEdit$.next(this.message);
  }

  loadFile(url: string): void {
    this.chatsService.getFile(url).subscribe((blob) => {
      const fileName = url.split('/').pop();
      this.downloadBlob(blob, fileName);
    });
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
