import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { ChatMessageView } from '../../model/chat-page.interface';
import { StatusTicksComponent } from '../status-ticks/status-ticks.component';
import { CHAT_ICONS } from '../../chat-icons';
import { ChatFacade } from '../../facade/chat.facade';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, StatusTicksComponent, MatMenuModule, TranslateModule],
  templateUrl: './messages-list.component.html'
})
export class MessagesListComponent implements AfterViewChecked {
  @Input() messages: ChatMessageView[] = [];
  @Output() openImage = new EventEmitter<string>();

  @ViewChild('scrollContainer') private readonly scrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  constructor(readonly facade: ChatFacade) {}

  readonly chatICons = CHAT_ICONS;
  private lastMsgCount = 0;

  selectedMessage?: ChatMessageView;
  pressTimer: any;
  matMenuPosition = { x: '0px', y: '0px' };

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

  onMessageEdit() {
    if (this.selectedMessage) {
      this.facade.selectMessage(this.selectedMessage);
      this.selectedMessage = null;
    }
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

  onMenuClosed() {
    this.selectedMessage = null;
  }

  onRightClick(event: MouseEvent, trigger: MatMenuTrigger, message: ChatMessageView) {
    if (message?.from != 'Me' || message?.images.length || message?.fileUrl) {
      return;
    }
    event.preventDefault();
    this.matMenuPosition.x = event.clientX + 'px';
    this.matMenuPosition.y = event.clientY - 20 + 'px';
    this.selectedMessage = message;
    this.menuTrigger.menu.focusFirstItem('mouse');
    trigger.openMenu();
  }

  onTouchStart(event: TouchEvent, trigger: MatMenuTrigger, message: ChatMessageView) {
    if (message?.from != 'Me' && message?.text && !message?.images.length && !message?.fileUrl) {
      return;
    }
    this.selectedMessage = message;
    this.pressTimer = setTimeout(() => {
      const touch = event.touches[0];
      this.matMenuPosition.x = touch.clientX + 'px';
      this.matMenuPosition.y = touch.clientY - 20 + 'px';
      trigger.openMenu();
    }, 600);
  }

  onTouchEnd(event: TouchEvent) {
    clearTimeout(this.pressTimer);
  }

  onTouchMove(event: TouchEvent) {
    clearTimeout(this.pressTimer);
  }
}
