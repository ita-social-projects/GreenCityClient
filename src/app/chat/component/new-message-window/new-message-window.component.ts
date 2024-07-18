import { Component, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { CHAT_ICONS } from '../../chat-icons';
import { FormControl, Validators } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { ChatsService } from '../../service/chats/chats.service';
import { Subject } from 'rxjs';
import { CommonService } from '../../service/common/common.service';
import { SocketService } from '../../service/socket/socket.service';
import { Message, MessageExtended } from '../../model/Message.model';
import { UserService } from '@global-service/user/user.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Role } from '@global-models/user/roles.model';
import { MatDialog } from '@angular/material/dialog';
import { WarningPopUpComponent } from '@shared/components';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-new-message-window',
  templateUrl: './new-message-window.component.html',
  styleUrls: ['./new-message-window.component.scss']
})
export class NewMessageWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  public chatIcons = CHAT_ICONS;
  private onDestroy$ = new Subject();
  public messageControl: FormControl = new FormControl('', [Validators.max(250)]);
  public showEmojiPicker = false;
  public isHaveMessages = true;
  public isAdmin: boolean;
  public isEditMode: boolean;
  public messageToEdit: Message;
  public currentChatMessages: Observable<MessageExtended[]>;
  public isSupportChat: boolean;
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

  uploadedFile: File;
  @Input() class: string;
  @ViewChild('chat') chat: ElementRef;
  currentPath: string;

  constructor(
    public chatsService: ChatsService,
    private commonService: CommonService,
    private socketService: SocketService,
    public userService: UserService,
    private jwt: JwtService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.currentPath = this.router.url;
  }

  ngOnInit(): void {
    this.currentChatMessages = this.chatsService.currentChatMessages$;
    this.chatsService.currentChatsStream$.pipe(takeUntil(this.onDestroy$)).subscribe((chat) => {
      if (chat) {
        this.socketService.subscribeToUpdateDeleteMessage(chat.id);
      }
    });

    this.chatsService.currentChatMessagesStream$.subscribe((messages) => {
      this.isHaveMessages = messages.length !== 0;
      setTimeout(() => {
        if (this.chat?.nativeElement) {
          const chatElem = this.chat.nativeElement;
          chatElem.scrollTop = chatElem.scrollHeight - chatElem.clientHeight;
        }
      });
    });
    this.isAdmin = this.jwt.getUserRole() === Role.UBS_EMPLOYEE || this.jwt.getUserRole() === Role.ADMIN;
    this.isSupportChat = this.chatsService.isSupportChat;
  }

  ngAfterViewInit(): void {
    const element: HTMLElement = this.chat.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  public close(): void {
    this.commonService.newMessageWindowRequireCloseStream$.next(true);
  }

  public checkChat(friend: any) {
    if (friend.friendsChatDto.chatExists) {
      const userChat = this.chatsService.userChats.find((chat) => chat.id === friend.friendsChatDto.chatId);
      this.chatsService.setCurrentChat(userChat);
    } else {
      this.socketService.createNewChat(friend.id, false, true);
    }
  }

  public sendMessage(): void {
    const message: Message = {
      roomId: this.chatsService.currentChat.id,
      senderId: this.userService.userId,
      content: this.messageControl.value
    };
    if (this.uploadedFile) {
      this.chatsService
        .sendMessageWithFile(message, this.uploadedFile)
        .pipe(take(1))
        .subscribe((data: Message) => {
          this.uploadedFile = null;
          this.messageControl.setValue('');
          const newMessage: Message = data;
          const messages = this.chatsService.currentChatMessages;
          if (messages) {
            messages.push(newMessage);
            this.chatsService.currentChatMessagesStream$.next([...messages]);
          }
        });
      return;
    }

    if (!this.isEditMode) {
      this.socketService.sendMessage(message);
    } else {
      this.socketService.updateMessage({ ...this.messageToEdit, ...{ content: this.messageControl.value } });
      this.isEditMode = false;
      this.messageToEdit = null;
    }

    this.messageControl.setValue('');
  }

  fileChanges(event: Event): void {
    this.uploadedFile = (event.target as HTMLInputElement).files[0];
    this.isEditMode = false;
  }

  loadFile(url: string): void {
    this.chatsService.getFile(url).subscribe((blob) => {
      const fileName = url.split('/').pop();
      this.downloadBlob(blob, fileName);
    });
  }

  downloadBlob(blob: Blob, fileName: string): void {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: EmojiEvent): void {
    const newValue = this.messageControl.value ? this.messageControl.value + event.emoji.native : event.emoji.native;
    this.messageControl.setValue(newValue);
  }

  openDeleteMessageDialog(message: MessageExtended): void {
    this.dialog
      .open(WarningPopUpComponent, this.dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          const { id, roomId, senderId, content } = message;
          this.socketService.removeMessage({ id, roomId, senderId, content });
        }
      });
  }

  toggleEditMode(message?: MessageExtended): void {
    if (message) {
      this.isEditMode = true;
      this.uploadedFile = null;
      const { id, roomId, senderId, content } = message;
      this.messageToEdit = { id, roomId, senderId, content };
      this.messageControl.setValue(message.content);
    } else {
      this.isEditMode = false;
      this.messageToEdit = null;
      this.messageControl.setValue('');
    }
  }

  ngOnDestroy(): void {
    this.socketService.updateDeleteMessageSubs.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
