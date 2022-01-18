import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatsService } from '../../service/chats/chats.service';
import { CHAT_ICONS } from '../../chat-icons';
import { Message } from '../../model/Message.model';
import { FormControl } from '@angular/forms';
import { SocketService } from '../../service/socket/socket.service';
import { UserService } from '@global-service/user/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  public chatIcons = CHAT_ICONS;
  public shouldNotBeScrolled = false;
  @ViewChild('chat') chat: ElementRef;
  public messageControl: FormControl = new FormControl();
  showEmojiPicker = false;

  private page: number = 0;
  private oldScrollHeight: number;

  constructor(public chatsService: ChatsService, private socketService: SocketService, public userService: UserService) {}

  ngOnInit(): void {
    this.chatsService.currentChatMessagesStream$.subscribe(() => {
      this.shouldNotBeScrolled = false;
    });
  }

  ngAfterViewChecked(): void {
    const element: HTMLElement = this.chat.nativeElement;
    // if(this.shouldNotBeScrolled){
    //   element.scrollTop = element.scrollHeight - this.oldScrollHeight + element.scrollTop;
    // }
    // element.scrollTop = element.scrollHeight - element.scrollTop;
    if (!this.shouldNotBeScrolled) {
      this.shouldNotBeScrolled = true;
      element.scrollTop = element.scrollHeight;
    }
    this.oldScrollHeight = element.scrollHeight;
  }

  sendMessage() {
    const message: Message = {
      roomId: this.chatsService.currentChat.id,
      senderId: this.userService.userId,
      content: this.messageControl.value
    };
    this.messageControl.reset();
    this.socketService.sendMessage(message);
  }

  onScroll() {
    this.page += 1;
    this.chatsService.updateChatMessages(this.chatsService.currentChat.id, this.page);
  }

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    console.log(event);
  }

  newChat() {
    this.socketService.createNewChat();
  }
}
