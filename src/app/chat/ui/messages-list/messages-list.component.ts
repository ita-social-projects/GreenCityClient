import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChatMessageView } from '../../model/chat-page.interface';
import { StatusTicksComponent } from '../status-ticks/status-ticks.component';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase, StatusTicksComponent],
  templateUrl: './messages-list.component.html'
})
export class MessagesListComponent {
  @Input() messages: ChatMessageView[] = [];
  @Output() openImage = new EventEmitter<string>();
}
