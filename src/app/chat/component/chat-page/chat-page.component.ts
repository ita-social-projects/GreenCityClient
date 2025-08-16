import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChatFacade } from '../../facade/chat.facade';
import { ClientInfoPanelComponent } from '../client-info-panel/client-info-panel.component';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { ChatSidebarComponent } from '../../ui/chat-sidebar/chat-sidebar.component';
import { MessagesListComponent } from '../../ui/messages-list/messages-list.component';
import { MessageInputComponent } from '../../ui/message-input/message-input.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-page.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    TranslateModule,
    ClientInfoPanelComponent,
    ImageModalComponent,
    ChatSidebarComponent,
    MessagesListComponent,
    MessageInputComponent
  ],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebarRoot', { static: true }) sidebarRoot!: ElementRef<HTMLElement>;
  @ViewChild('pagingAnchor') pagingAnchor!: ElementRef<HTMLElement>;
  private io?: IntersectionObserver;

  constructor(public facade: ChatFacade) {}

  ngOnInit(): void {
    const selectedChatId = (history.state as { selectedChatId?: number })?.selectedChatId;
    this.facade.init(selectedChatId);
  }
  ngAfterViewInit(): void {
    if (!this.sidebarRoot || !this.pagingAnchor) {
      return;
    }

    let ticking = false;

    this.io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) {
          return;
        }
        if (ticking) {
          return;
        }
        ticking = true;
        this.facade.loadNextPage();
        setTimeout(() => {
          ticking = false;
        }, 200);
      },
      { root: this.sidebarRoot.nativeElement, rootMargin: '0px 0px 200px 0px', threshold: 0 }
    );
    this.io.observe(this.pagingAnchor.nativeElement);
  }
}
