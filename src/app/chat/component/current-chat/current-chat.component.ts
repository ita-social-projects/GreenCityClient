import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { ChatsService } from '../../service/chats/chats.service';
import { CHAT_ICONS } from '../../chat-icons';

@Component({
  selector: 'app-current-chat',
  templateUrl: './current-chat.component.html',
  styleUrls: ['./current-chat.component.scss']
})
export class CurrentChatComponent {
  public chatIcons = CHAT_ICONS;

  constructor(public chatsService: ChatsService, private translate: TranslateService) {}
}
