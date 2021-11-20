import { Component, OnDestroy, OnInit } from '@angular/core';
import { CHAT_ICONS } from '../../chat-icons';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ChatsService } from '../../service/chats/chats.service';
import { Subject } from 'rxjs';
import { CommonService } from '../../service/common/common.service';
import { SocketService } from '../../service/socket/socket.service';
import { Message } from '../../model/Message.model';
import { UserService } from '@global-service/user/user.service';

@Component({
  selector: 'app-new-message-window',
  templateUrl: './new-message-window.component.html',
  styleUrls: ['./new-message-window.component.scss']
})
export class NewMessageWindowComponent implements OnInit, OnDestroy {
  public chatIcons = CHAT_ICONS;
  public userSearchField = '';
  private onDestroy$ = new Subject();
  public userSearchControl: FormControl = new FormControl();
  public messageControl: FormControl = new FormControl('', [Validators.max(250)]);

  constructor(
    public chatsService: ChatsService,
    private commonService: CommonService,
    private socketService: SocketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userSearchControl.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe((newInput) => {
      this.userSearchField = newInput;
    });
  }

  public close() {
    this.commonService.newMessageWindowRequireCloseStream$.next(true);
  }

  public sendMessage() {
    const message: Message = {
      chatId: this.chatsService.currentChat.id,
      senderId: this.userService.userId,
      messageText: this.messageControl.value,
      messageDate: new Date()
    };
    this.socketService.sendMessage(message);
    this.close();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
