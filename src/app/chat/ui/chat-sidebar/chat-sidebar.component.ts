import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatListItem } from '../../model/chat-page.interface';
import { StatusTicksComponent } from '../status-ticks/status-ticks.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [NgForOf, FormsModule, StatusTicksComponent, TranslateModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent {
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
}
