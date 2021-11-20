import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../service/chats/chats.service';
import { CHAT_ICONS } from '../../chat-icons';

@Component({
  selector: 'app-current-chat',
  templateUrl: './current-chat.component.html',
  styleUrls: ['./current-chat.component.scss']
})
export class CurrentChatComponent implements OnInit {
  public chatIcons = CHAT_ICONS;

  constructor(public chatsService: ChatsService) {}

  ngOnInit(): void {}
}
