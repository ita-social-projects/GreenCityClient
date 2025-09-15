import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { ChatMessageView } from '../../model/chat-page.interface';
import { StatusTicksComponent } from '../status-ticks/status-ticks.component';
import { CHAT_ICONS } from '../../chat-icons';
import { ChatFacade } from '../../facade/chat.facade';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, StatusTicksComponent],
  templateUrl: './messages-list.component.html'
})
export class MessagesListComponent implements AfterViewChecked {
  @Input() messages: ChatMessageView[] = [];
  @Output() openImage = new EventEmitter<string>();

  @ViewChild('scrollContainer') private readonly scrollContainer!: ElementRef<HTMLDivElement>;

  constructor(readonly facade: ChatFacade) {}

  readonly chatICons = CHAT_ICONS;
  private lastMsgCount = 0;

  ngAfterViewChecked(): void {
    if (this.messages.length !== this.lastMsgCount) {
      const newMessages = this.messages.slice(this.lastMsgCount);

      if (newMessages.some((m) => m.images?.length)) {
        this.waitForImagesToLoad().then(() => this.scrollToBottom());
      } else {
        this.scrollToBottom();
      }

      this.lastMsgCount = this.messages.length;
    }
  }

  onMessageEdit(message: ChatMessageView) {
    this.facade.selectMessage(message);
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  private waitForImagesToLoad(): Promise<void> {
    const el = this.scrollContainer?.nativeElement;
    if (!el) {
      return Promise.resolve();
    }

    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
    const unloaded = imgs.filter((img) => !img.complete);

    if (unloaded.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let remaining = unloaded.length;
      unloaded.forEach((img) =>
        img.addEventListener('load', () => {
          remaining--;
          if (remaining === 0) {
            resolve();
          }
        })
      );
    });
  }
}
