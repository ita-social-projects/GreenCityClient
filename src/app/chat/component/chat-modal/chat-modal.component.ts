import { Component, HostListener, OnInit } from '@angular/core';
import { ChatsService } from '../../service/chats/chats.service';
import { CHAT_ICONS } from '../../chat-icons';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit {
  public chatIcons = CHAT_ICONS;
  isSupportChat: boolean;
  isMobile: boolean;
  breakpoint = 768;

  constructor(private dialogRef: MatDialogRef<ChatModalComponent>, private chatsService: ChatsService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < this.breakpoint;
  }

  ngOnInit(): void {
    this.isSupportChat = this.chatsService.isSupportChat;
    this.isMobile = window.innerWidth < this.breakpoint;
  }

  close() {
    this.chatsService.setCurrentChat(null);
    this.chatsService.chatsMessages = {};
    this.dialogRef.close();
  }
}
