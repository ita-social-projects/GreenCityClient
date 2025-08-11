import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ClientInfoPanelComponent } from '../client-info-panel/client-info-panel.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';
import { environment } from '@environment/environment';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { TelegramSocketService } from '../../service/chats/telegram-socket.service';
import {
  ChatListItem,
  PaginatedResponse,
  ChatDto,
  MessageDto,
  AssetDto,
  NewChatEvent,
  MessageEvent,
  ChatMessageView,
  ClientInfoData
} from '../../model/chat-page.interface';
import { ClientInfoRecord } from '../../model/chat-page.interface';
import { SocketNewChat } from '../../model/socket-new-chat.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-page.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgForOf, FormsModule, NgClass, NgIf, HttpClientModule, ClientInfoPanelComponent, ImageModalComponent, TranslateModule],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent implements OnInit {
  chats: ChatListItem[] = [];
  filteredChats: ChatListItem[] = [];
  selectedChat: ChatListItem | null = null;
  selectedChatId?: number;

  newMessage = '';
  selectedFile: File | null = null;
  caption = '';

  clientInfoVisible = false;
  clientInfoData: ClientInfoData = null;

  searchId = '';
  selectedImageUrl: string | null = null;

  currentPage = 0;
  totalPages = 1;
  pageSize = 20;
  isLoadingChats = false;

  private readonly baseUrl = `${environment.ubsAdmin.backendUbsAdminLink}/telegram`;

  @ViewChild('messagesContainer') private readonly messagesContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private readonly store: Store,
    private readonly translate: TranslateService,
    private readonly telegramSocketService: TelegramSocketService,
    private readonly zone: NgZone
  ) {}

  private extractInternalId(nc: SocketNewChat): number {
    const candidate = (nc as any).id ?? (nc as any).chatInternalId ?? (nc as any).internalId;
    if (typeof candidate !== 'number') {
      throw new Error('SocketNewChat payload missing internal id.');
    }
    return candidate;
  }

  ngOnInit(): void {
    const state = history.state as { selectedChatId?: number } | undefined;
    if (state?.selectedChatId) {
      this.selectedChatId = state.selectedChatId;
    }
    this.store.select(userRoleSelector).pipe(take(1)).subscribe();

    this.telegramSocketService.newChats$.subscribe((newChat: SocketNewChat) => {
      const internalId = this.extractInternalId(newChat);

      const chatIdStr = String(newChat.chatId);
      const { name, initial } = this.buildName(newChat.username, (newChat as any).firstName, (newChat as any).lastName, chatIdStr);

      this.chats.unshift({
        name,
        initial,
        chatId: chatIdStr,
        chatInternalId: internalId,
        lastMessage: (newChat as any).lastMessage?.text ?? '',
        time: (newChat as any).lastMessage?.sendAt ? this.toTime((newChat as any).lastMessage.sendAt) : '',
        messages: []
      });

      this.filteredChats = [...this.chats];
    });

    this.loadAllChats(this.currentPage);
  }

  private scrollToBottom(): void {
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTo({
          top: this.messagesContainer.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }

  loadAllChats(page: number = 0): void {
    if (this.isLoadingChats || page >= this.totalPages) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    this.isLoadingChats = true;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const pageableObject = { page, size: this.pageSize, sort: ['sendAt,desc'] as string[] };
    const params = new HttpParams().set('pageable', JSON.stringify(pageableObject));
    const url = `${this.baseUrl}/chats`;

    this.http.get<PaginatedResponse<ChatDto>>(url, { headers, params }).subscribe({
      next: (response) => {
        const chatList = response.page ?? [];

        const newChats: ChatListItem[] = chatList.map((chat) => {
          const { name, initial } = this.buildName(chat.username, chat.firstName, chat.lastName, chat.chatId);
          return {
            name,
            initial,
            chatId: chat.chatId,
            chatInternalId: chat.id,
            lastMessage: chat.lastMessage?.text ?? '',
            time: chat.lastMessage?.sendAt ? this.toTime(chat.lastMessage.sendAt) : '',
            messages: []
          };
        });

        this.chats = [...this.chats, ...newChats];
        this.filteredChats = [...this.chats];

        this.totalPages = response.totalPages;
        this.currentPage = page;
        this.isLoadingChats = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load chats:', err);
        this.isLoadingChats = false;
      }
    });
  }

  selectChat(chat: ChatListItem): void {
    this.selectedChat = chat;
    this.clientInfoVisible = false;
    this.clientInfoData = null;
    this.fetchMessages(chat.chatInternalId);

    this.telegramSocketService.subscribeToMessages(chat.chatInternalId).subscribe((newMessage: MessageEvent) => {
      if (!this.selectedChat) {
        return;
      }

      this.selectedChat.messages.push({
        from: newMessage.fromManager ? 'Me' : this.selectedChat.name,
        text: newMessage.text,
        time: this.toTime(newMessage.sendAt),
        images: (newMessage.assets ?? []).filter((a) => a.type === 'IMAGE').map((a) => a.url)
      });

      this.selectedChat.lastMessage = newMessage.text;
      this.selectedChat.time = this.toTime(newMessage.sendAt);
      this.scrollToBottom();
    });
  }

  fetchMessages(chatInternalId: number, callback?: () => void): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const pageSize = 20;
    const allMessages: MessageDto[] = [];

    this.loadMessagePage(chatInternalId, 0, headers, pageSize, allMessages, callback);
  }

  private loadMessagePage(
    chatId: number,
    page: number,
    headers: HttpHeaders,
    pageSize: number,
    allMessages: MessageDto[],
    callback?: () => void
  ): void {
    const url = `${this.baseUrl}/messages/${chatId}?page=${page}&size=${pageSize}&sort=sendAt,desc`;

    this.http.get<PaginatedResponse<MessageDto>>(url, { headers }).subscribe({
      next: (response) => this.handleMessageResponse(chatId, response, page, headers, pageSize, allMessages, callback),
      error: (err: unknown) => this.handleMessageError(err, callback)
    });
  }

  private handleMessageResponse(
    chatId: number,
    response: PaginatedResponse<MessageDto>,
    page: number,
    headers: HttpHeaders,
    pageSize: number,
    allMessages: MessageDto[],
    callback?: () => void
  ): void {
    const messages = response.page ?? [];
    allMessages.push(...messages);

    if (page + 1 < response.totalPages) {
      this.loadMessagePage(chatId, page + 1, headers, pageSize, allMessages, callback);
    } else if (this.selectedChat) {
      this.selectedChat.messages = allMessages
        .map<ChatMessageView>((msg) => ({
          from: msg.fromManager ? 'Me' : this.selectedChat?.name,
          text: msg.text,
          time: this.toTime(msg.sendAt),
          images: (msg.assets ?? []).filter((a) => a.type === 'IMAGE').map((a) => a.url)
        }))
        .reverse();
      this.scrollToBottom();
      callback?.();
    }
  }

  private handleMessageError(error: unknown, callback?: () => void): void {
    console.error('Failed to fetch messages:', error);
    callback?.();
  }

  sendMessage(): void {
    if ((!this.newMessage.trim() && !this.selectedFile) || !this.selectedChat) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.baseUrl}/messages`;

    const messagePayload = {
      chatId: this.selectedChat.chatInternalId,
      text: this.newMessage.trim()
    };

    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(messagePayload)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    if (this.selectedFile) {
      formData.append('files', this.selectedFile);
    }

    this.http.post<string>(url, formData, { headers, responseType: 'text' as 'json' }).subscribe({
      next: () => {
        if (!this.selectedChat) {
          return;
        }

        const time = this.toTime(new Date().toISOString());
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
        this.scrollToBottom();
      },
      error: (err: unknown) => {
        console.error('Failed to send message:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maxSizeMb = 5;

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > maxSizeMb) {
      alert(`File is too large. Max size is ${maxSizeMb}MB.`);
      return;
    }

    this.selectedFile = file;
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

    this.http.get<ClientInfoRecord>(url, { headers }).subscribe({
      next: (response) => {
        this.clientInfoData = response;
      },
      error: (err: { status?: number }) => {
        console.error('Failed to load client info:', err);
        this.clientInfoData = {
          error: this.translate.instant(err?.status === 404 ? 'client-panel.no-orders' : 'client-panel.error')
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

  private buildName(
    username?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    fallback?: string | number
  ): { name: string; initial: string } {
    const fullName = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : '';
    const fb = fallback != null ? String(fallback) : '';
    const raw = username || fullName || fb;
    const name = raw || 'Unknown';
    const initial = raw ? raw.charAt(0).toUpperCase() : '?';
    return { name, initial };
  }

  private toTime(isoOrDateString: string): string {
    const d = new Date(isoOrDateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
