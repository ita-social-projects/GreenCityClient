import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
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
    MessageInputComponent,
    MatIconModule
  ],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidebarRoot', { static: true }) sidebarRoot!: ElementRef<HTMLElement>;
  @ViewChild('pagingAnchor') pagingAnchor!: ElementRef<HTMLElement>;
  isMobileView = false;
  showChats = true;
  private io?: IntersectionObserver;
  private readonly destroy$ = new Subject<void>();

  constructor(
    public facade: ChatFacade,
    public route: ActivatedRoute
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileView = window.innerWidth <= 700;
    if (this.isMobileView) {
      this.showChats = true;
    }
  }

  ngOnInit(): void {
    this.onResize();
    this.facade.init(Number(this.route.snapshot.queryParams['chatId']));
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.facade.selectChatById(Number(params['chatId']));
    });
  }

  ngAfterViewInit(): void {
    if (!this.sidebarRoot || !this.pagingAnchor) {
      return;
    }

    let ticking = false;

    this.io = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting)) {
          return;
        }
        if (ticking) {
          return;
        }
        ticking = true;

        this.facade.loadNextPage();

        await new Promise((resolve) => setTimeout(resolve, 200));

        ticking = false;
      },
      {
        root: this.sidebarRoot.nativeElement,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0
      }
    );

    this.io.observe(this.pagingAnchor.nativeElement);
  }

  messageController(text: string, file?: File) {
    if (!this.facade.selectedMessage) {
      this.facade.sendMessage(text, file);
    } else {
      this.facade.editMessage(text);
    }
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeChat(): void {
    if (this.isMobileView) {
      this.showChats = false;
    }
  }
}
