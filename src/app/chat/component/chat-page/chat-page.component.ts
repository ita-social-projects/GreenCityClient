import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ClientInfoPanelComponent } from '../client-info-panel/client-info-panel.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';
import { environment } from '@environment/environment';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-page.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgForOf, FormsModule, NgClass, NgIf, HttpClientModule, ClientInfoPanelComponent, ImageModalComponent, TranslateModule],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();
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

  private readonly baseUrl = `${environment.ubsAdmin.backendUbsAdminLink}/telegram`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private readonly store: Store,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (history.state.selectedChatId) {
      this.selectedChatId = history.state.selectedChatId;
      this.location.replaceState(`/ubs/admin/chat-page/${this.selectedChatId}`);
    }
    this.route.params.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.selectedChatId = Number(params.id);
    });
    this.store.select(userRoleSelector).pipe(take(1));
    this.loadAllChats();
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

          return {
            fullName,
            nickname,
            initial,
            chatId: chat.chatId,
            chatInternalId: chat.id,
            lastMessage: chat.lastMessage?.text || '',
            time: chat.lastMessage?.sendAt
              ? new Date(chat.lastMessage.sendAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '',
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

  selectChat(chat: any): void {
    if (chat) {
      this.selectedChat = chat;
      this.location.replaceState(`/ubs/admin/chat-page/${chat.chatInternalId}`);
      this.clientInfoVisible = false;
      this.clientInfoData = null;
      this.fetchMessages(chat.chatInternalId);
    }
  }

  fetchMessages(chatInternalId: number, callback?: () => void): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const pageSize = 20;
    const allMessages: any[] = [];

    this.loadMessagePage(chatInternalId, 0, headers, pageSize, allMessages, callback);
  }

  private loadMessagePage(
    chatId: number,
    page: number,
    headers: HttpHeaders,
    pageSize: number,
    allMessages: any[],
    callback?: () => void
  ): void {
    const url = `${this.baseUrl}/messages/${chatId}?page=${page}&size=${pageSize}&sort=sendAt,desc`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => this.handleMessageResponse(chatId, response, page, headers, pageSize, allMessages, callback),
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
    callback?: () => void
  ): void {
    const messages = response.page || [];
    allMessages.push(...messages);

    if (page + 1 < response.totalPages) {
      this.loadMessagePage(chatId, page + 1, headers, pageSize, allMessages, callback);
    } else {
      this.selectedChat.messages = allMessages
        .map((msg: any) => ({
          from: msg.fromManager ? 'Me' : this.selectedChat.nickname,
          text: msg.text,
          time: new Date(msg.sendAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          images: (msg.assets || []).filter((a: any) => a.type === 'IMAGE').map((a: any) => a.url)
        }))
        .reverse();

      if (callback) {
        callback();
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
    console.log('close image modal');
    this.selectedImageUrl = null;
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
