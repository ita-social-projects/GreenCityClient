import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatListItem } from '../../model/chat-page.interface';
import { StatusTicksComponent } from '../status-ticks/status-ticks.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [NgForOf, FormsModule, StatusTicksComponent, TranslateModule, NgIf],
  templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnChanges {
  @Input() chats: ChatListItem[] = [];
  @Input() loading = false;
  @Output() selectChat = new EventEmitter<ChatListItem>();
  @Output() searchChange = new EventEmitter<string>();

  searchId = '';
  onInput() {
    this.searchChange.emit(this.searchId);
  }
  trackById(_: number, c: ChatListItem) {
    return c.chatInternalId;
  }

  ngOnChanges(): void {
    if (this.chats.length === 1) {
      this.selectChat.emit(this.chats[0]);
    }
  }
}
