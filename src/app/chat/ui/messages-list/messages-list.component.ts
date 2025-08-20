import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { ChatMessageView } from '../../model/chat-page.interface';
import { StatusTicksComponent } from '../status-ticks/status-ticks.component';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, StatusTicksComponent],
  templateUrl: './messages-list.component.html'
})
export class MessagesListComponent implements AfterViewChecked {
  @Input() messages: ChatMessageView[] = [];
  @Output() openImage = new EventEmitter<string>();

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;

  private lastMsgCount = 0;

  ngAfterViewChecked(): void {
    if (this.messages.length !== this.lastMsgCount) {
      this.scrollToBottom();
      this.lastMsgCount = this.messages.length;
    }
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
