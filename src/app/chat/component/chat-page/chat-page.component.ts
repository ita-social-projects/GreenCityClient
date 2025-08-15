import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ClientInfoPanelComponent } from '../client-info-panel/client-info-panel.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, take, takeUntil } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';
import { environment } from '@environment/environment';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-page.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgForOf, FormsModule, NgClass, NgIf, HttpClientModule, ClientInfoPanelComponent, ImageModalComponent, TranslateModule],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  chats: any[] = [];
  selectedChat: any = null;
  selectedChatId?: number;
  newMessage = '';
  selectedFile: File | null = null;
  caption = '';
  clientInfoVisible = false;
  clientInfoData: any = null;
  filteredChats: any[] = [];
  searchId = '';
  selectedImageUrl: string | null = null;
  private messagesLoadToken = 0;
  private loadingForChatId?: number;
  private destroy$ = new Subject<void>();
  private readonly baseUrl = `${environment.ubsAdmin.backendUbsAdminLink}/telegram`;

  @ViewChild('messagesRef') private messagesRef?: ElementRef<HTMLDivElement>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private readonly store: Store,
    private readonly translate: TranslateService,
    private readonly route: ActivatedRoute,
    private readonly ngZone: NgZone,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    if (history.state.selectedChatId) {
      this.selectedChatId = history.state.selectedChatId;
    }
    this.route.queryParamMap
      .pipe(
        map((qp) => {
          const v = Number(qp.get('chatId'));
          return Number.isFinite(v) ? v : undefined;
        }),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((id) => {
        if (!id) {
          return;
        }
        if (this.selectedChatId === id) {
          return;
        }
        if (!this.chats.length) {
          this.selectedChatId = id;
          return;
        }
        const found = this.chats.find((c) => c.chatInternalId === id);
        if (found) {
          this.selectChat(found);
        }
      });
    this.store.select(userRoleSelector).pipe(take(1)).subscribe();
    this.loadAllChats();
  }

  private scrollToBottom(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        const el = this.messagesRef?.nativeElement;
        if (!el) {
          return;
        }
        el.scrollTop = el.scrollHeight;
      });
    });
  }

  private scrollToBottomAfterRender(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => this.scrollToBottom()));
    });
  }

  private scrollWindowToTop(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
    });
  }
  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private formatChatTimestamp(d: Date): string {
    const now = new Date();
    if (this.isSameDay(d, now)) {
      return d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    }
    const datePart = d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timePart = d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} ${timePart}`;
  }

  loadAllChats(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/chats`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        const chatList = response.page || [];

        this.chats = chatList.map((chat: any) => {
          let fullName = chat.user ? `${chat.user.firstName || ''} ${chat.user.lastName || ''}`.trim() : null;

          if (!fullName) {
            fullName = chat.firstName || chat.lastName ? `${chat.firstName || ''} ${chat.lastName || ''}`.trim() : '';
          }

          const raw = chat.username || fullName || chat.chatId;
          const nickname = raw || 'Unknown';
          const initial = raw ? raw.charAt(0).toUpperCase() : '?';
          const sendAt: Date | null = chat.lastMessage?.sendAt ? new Date(chat.lastMessage.sendAt) : null;

          return {
            fullName,
            nickname,
            initial,
            chatId: chat.chatId,
            chatInternalId: chat.id,
            lastMessage: chat.lastMessage?.text || '',
            time: sendAt ? this.formatChatTimestamp(sendAt) : '',
            messages: []
          };
        });
        this.filteredChats = [...this.chats];
        if (this.selectedChatId) {
          this.selectChat(this.chats.find((chatElement) => chatElement.chatInternalId === this.selectedChatId));
        }
      },
      error: (err) => {
        console.error('Failed to load chats:', err);
      }
    });
  }
  private setChatIdInUrlSilently(id: number): void {
    const tree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { chatId: id },
      queryParamsHandling: 'merge'
    });
    this.location.replaceState(this.router.serializeUrl(tree));
  }
  selectChat(chat: any): void {
    if (!chat) {
      return;
    }
    if (this.selectedChatId === chat.chatInternalId && this.selectedChat) {
      return;
    }

    this.selectedChatId = chat.chatInternalId;
    this.selectedChat = chat;
    this.clientInfoVisible = false;
    this.clientInfoData = null;

    const myToken = ++this.messagesLoadToken;
    this.loadingForChatId = chat.chatInternalId;

    this.scrollWindowToTop();

    this.fetchMessages(chat.chatInternalId, myToken, () => {
      if (this.messagesLoadToken === myToken) {
        this.scrollToBottomAfterRender();
        this.scrollWindowToTop();
      }
    });

    const currentId = Number(this.route.snapshot.queryParamMap.get('chatId'));
    if (currentId !== this.selectedChatId) {
      this.setChatIdInUrlSilently(this.selectedChatId);
    }
  }

  fetchMessages(chatInternalId: number, token: number, callback?: () => void): void {
    const tokenStr = localStorage.getItem('accessToken');
    if (!tokenStr) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${tokenStr}`);
    const pageSize = 20;
    const allMessages: any[] = [];

    this.selectedChat.messages = [];

    this.loadMessagePage(chatInternalId, 0, headers, pageSize, allMessages, token, callback);
  }

  private loadMessagePage(
    chatId: number,
    page: number,
    headers: HttpHeaders,
    pageSize: number,
    allMessages: any[],
    token: number,
    callback?: () => void
  ): void {
    const url = `${this.baseUrl}/messages/${chatId}?page=${page}&size=${pageSize}&sort=sendAt,desc`;

    if (this.messagesLoadToken !== token) {
      return;
    }

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => this.handleMessageResponse(chatId, response, page, headers, pageSize, allMessages, token, callback),
      error: (err) => this.handleMessageError(err, callback)
    });
  }

  private handleMessageResponse(
    chatId: number,
    response: any,
    page: number,
    headers: HttpHeaders,
    pageSize: number,
    allMessages: any[],
    token: number,
    callback?: () => void
  ): void {
    if (this.messagesLoadToken !== token) {
      return;
    }

    const messages = response.page || [];
    allMessages.push(...messages);

    if (page + 1 < response.totalPages) {
      this.loadMessagePage(chatId, page + 1, headers, pageSize, allMessages, token, callback);
    } else {
      if (this.messagesLoadToken === token) {
        this.selectedChat.messages = allMessages
          .map((msg: any) => ({
            id: msg.id,
            from: msg.fromManager ? 'Me' : this.selectedChat.nickname,
            text: msg.text,
            time: msg.sendAt ? this.formatChatTimestamp(new Date(msg.sendAt)) : '',
            images: (msg.assets || []).filter((a: any) => a.type === 'IMAGE').map((a: any) => a.url)
          }))
          .reverse();

        callback?.();
      }
    }
  }

  private handleMessageError(error: any, callback?: () => void): void {
    console.error('Failed to fetch messages:', error);
    if (callback) {
      callback();
    }
  }

  sendMessage(): void {
    if ((!this.newMessage.trim() && !this.selectedFile) || !this.selectedChat) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.baseUrl}/messages`;

    const messagePayload = {
      chatId: this.selectedChat.chatInternalId,
      text: this.newMessage.trim()
    };

    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(messagePayload)], {
      type: 'application/json'
    });
    formData.append('data', jsonBlob);

    if (this.selectedFile) {
      formData.append('files', this.selectedFile);
    }

    this.http
      .post(url, formData, {
        headers,
        responseType: 'text' as 'json'
      })
      .subscribe({
        next: () => {
          const now = new Date();
          const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const imagePreviewUrl = this.selectedFile ? URL.createObjectURL(this.selectedFile) : null;

          this.selectedChat.messages.push({
            from: 'Me',
            text: this.newMessage.trim(),
            time,
            images: imagePreviewUrl ? [imagePreviewUrl] : []
          });

          this.selectedChat.lastMessage = this.newMessage.trim();
          this.selectedChat.time = time;
          this.newMessage = '';
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Failed to send message:', err);
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maxSizeMb = 5;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const sizeMb = file.size / (1024 * 1024);

      if (sizeMb > maxSizeMb) {
        alert(`File is too large. Max size is ${maxSizeMb}MB.`);
        return;
      }

      this.selectedFile = file;
    }
  }

  toggleClientInfo(): void {
    this.clientInfoVisible = !this.clientInfoVisible;

    if (this.clientInfoVisible && this.selectedChat?.chatInternalId != null) {
      this.clientInfoData = null;
      this.fetchClientInfo(this.selectedChat.chatInternalId);
    }
  }

  fetchClientInfo(internalId: number): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/last-order?chatId=${internalId}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.clientInfoData = response;
      },
      error: (err) => {
        console.error('Failed to load client info:', err);

        this.clientInfoData = {
          error: this.translate.instant(err.status === 404 ? 'client-panel.no-orders' : 'client-panel.error')
        };
      }
    });
  }

  filterChatsById(): void {
    const trimmed = this.searchId.trim();
    this.filteredChats = trimmed ? this.chats.filter((chat) => chat.chatInternalId.toString().includes(trimmed)) : [...this.chats];
  }
  openImageModal(url: string): void {
    this.selectedImageUrl = url;
  }

  closeImageModal(): void {
    this.selectedImageUrl = null;
  }
  trackChat(index: number, chat: any): number {
    return chat.chatInternalId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
