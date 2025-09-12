import { Injectable, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatApiService } from '../data/chat-api.service';
import { ChatListItem, ChatDto, MessageDto, ChatMessageView, ClientInfoData, SocketNewChat } from '../model/chat-page.interface';
import { buildName, formatTimeOrDate, normalizeViewingStatus, toTime } from '../utils/chat-mappers';
import { Subscription } from 'rxjs';
import { TelegramSocketService } from '../service/chats/telegram-socket.service';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ChatFacade {
  readonly chats = signal<ChatListItem[]>([]);
  readonly searchId = signal('');
  readonly selectedChat = signal<ChatListItem | null>(null);
  readonly selectedImageUrl = signal<string | null>(null);

  readonly clientInfoVisible = signal(false);
  readonly clientInfoData = signal<ClientInfoData>(null);

  readonly isLoading = signal(false);
  readonly page = signal(0);
  readonly totalPages = signal(1);
  readonly pageSize = 20;
  private readonly location = inject(Location);

  readonly filteredChats = computed(() => {
    const q = this.searchId().trim();
    if (!q) {
      return this.chats();
    }
    return this.chats().filter((c) => c.chatInternalId.toString().includes(q));
  });

  private readonly destroyRef = inject(DestroyRef);
  private readonly tileSubs = new Map<number, Subscription>();
  private currentChatId?: number;
  private messagesSub?: Subscription;
  private resolveInternalId(nc: SocketNewChat): number {
    if ('id' in nc) {
      return nc.id;
    }
    if ('chatInternalId' in nc) {
      return nc.chatInternalId;
    }
    if ('internalId' in nc) {
      return nc.internalId;
    }
    throw new Error('SocketNewChat payload missing internal id.');
  }

  constructor(
    private readonly api: ChatApiService,
    private readonly socket: TelegramSocketService
  ) {
    this.socket.newChats$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((nc) => {
      const internalId = this.resolveInternalId(nc);
      const chatIdStr = String(nc.chatId);
      const { fullName, nickname, initial } = buildName(nc.username ?? null, nc.firstName ?? null, nc.lastName ?? null, chatIdStr);
      const item: ChatListItem = {
        fullName,
        nickname,
        initial,
        chatId: chatIdStr,
        chatInternalId: internalId,
        lastMessage: nc.lastMessage?.text ?? '',
        time: nc.lastMessage?.sendAt ? formatTimeOrDate(nc.lastMessage.sendAt) : '',
        messages: [],
        viewingStatus: normalizeViewingStatus(nc.lastMessage?.messageViewingStatus) || undefined,
        unreadMessagesCount: nc.unreadMessagesCount ?? 0
      };
      this.chats.update((arr) => {
        const i = arr.findIndex((c) => c.chatInternalId === internalId);
        return i === -1 ? [item, ...arr] : [item, ...arr.filter((c) => c.chatInternalId !== internalId)];
      });
      this.ensureTileSocket(internalId);
    });
  }

  init(initialSelectedChatId?: number) {
    this.loadPage(0, initialSelectedChatId);
  }

  loadNextPage() {
    const next = this.page() + 1;
    if (this.isLoading() || next >= this.totalPages()) {
      return;
    }
    this.loadPage(next);
  }

  private loadPage(page: number, initialSelectedChatId?: number) {
    this.isLoading.set(true);
    this.api.getChats(page, this.pageSize).subscribe({
      next: (resp) => {
        const mapped = (resp.page ?? []).map<ChatListItem>((chat: ChatDto) => {
          const { fullName, nickname, initial } = buildName(
            chat.username,
            chat?.user?.firstName || chat.firstName,
            chat?.user?.lastName || chat.lastName,
            chat.chatId
          );
          return {
            fullName,
            nickname,
            initial,
            chatId: chat.chatId,
            chatInternalId: chat.id,
            lastMessage: chat.lastMessage?.text ?? '',
            time: chat.lastMessage?.sendAt ? formatTimeOrDate(chat.lastMessage.sendAt) : '',
            messages: [],
            viewingStatus: normalizeViewingStatus(chat.lastMessage?.messageViewingStatus) || undefined,
            unreadMessagesCount: chat.unreadMessagesCount ?? 0
          };
        });

        this.chats.update((prev) => {
          const byId = new Map<number, ChatListItem>();
          for (const c of prev) {
            byId.set(c.chatInternalId, c);
          }
          for (const c of mapped) {
            byId.set(c.chatInternalId, c);
            this.ensureTileSocket(c.chatInternalId);
          }
          return Array.from(byId.values());
        });

        this.page.set(page);
        this.totalPages.set(resp.totalPages);
        this.isLoading.set(false);

        if (page === 0 && !Number.isNaN(initialSelectedChatId)) {
          const found = this.chats().find((c) => c.chatInternalId === initialSelectedChatId);
          if (found) {
            this.selectChat(found);
          }
        }
      },
      error: () => this.isLoading.set(false)
    });
  }
  private updateChatIdInUrl(chatId: number) {
    const full = this.location.path(true);
    let pathAndQuery = full;
    let hash = '';
    const hashIdx = full.indexOf('#');
    if (hashIdx >= 0) {
      pathAndQuery = full.slice(0, hashIdx);
      hash = full.slice(hashIdx);
    }

    const [pathOnly, queryOnly = ''] = pathAndQuery.split('?');
    const params = new URLSearchParams(queryOnly);
    params.set('chatId', String(chatId));

    const newQuery = params.toString();
    const newPath = newQuery ? `${pathOnly}?${newQuery}${hash}` : `${pathOnly}${hash}`;
    this.location.replaceState(newPath);
  }

  selectChatById(chatInternalId: number) { 
    const chat = this.chats().find((c) => c.chatInternalId === chatInternalId);
    if (chat) {
      this.selectChat(chat);
    }
  }

  selectChat(chat: ChatListItem) {
    if (this.currentChatId !== null) {
      this.messagesSub?.unsubscribe();
    }

    this.currentChatId = chat.chatInternalId;

    this.selectedChat.set(chat);
    this.clientInfoVisible.set(false);
    this.clientInfoData.set(null);
    this.updateChatIdInUrl(chat.chatInternalId);

    this.messagesSub = this.socket.subscribeToMessages(chat.chatInternalId).subscribe((m) => {
      const norm = normalizeViewingStatus(m.messageViewingStatus);
      const current = this.selectedChat();
      if (!current) {
        return;
      }

      current.messages.push({
        from: m.fromManager ? 'Me' : current.nickname,
        text: m.text,
        time: formatTimeOrDate(m.sendAt),
        images: (m.assets ?? []).filter((a) => a.type === 'IMAGE').map((a) => a.url),
        viewingStatus: norm
      });

      current.lastMessage = m.text;
      current.time = toTime(m.sendAt);

      if (norm) {
        current.viewingStatus = norm;
        const tile = this.chats().find((c) => c.chatInternalId === current.chatInternalId);
        if (tile) {
          tile.viewingStatus = norm;
        }
      }

      this.chats.update((list) => {
        const idx = list.findIndex((c) => c.chatInternalId === current.chatInternalId);
        if (idx === -1) {
          return list;
        }
        const updated = { ...list[idx], unreadMessagesCount: 0 };
        const copy = [...list];
        copy[idx] = updated;
        return copy;
      });

      this.selectedChat.set({ ...current });
    });

    this.fetchMessages(chat.chatInternalId);
    const unreadIds = (chat.messages ?? [])
      .filter((m) => m.viewingStatus === 'UNREAD')
      .map((m: any) => m.id)
      .filter(Boolean);
    if (this.currentChatId === chat.chatInternalId) {
      return;
    }
    if (unreadIds.length > 0) {
      this.api.markMessagesRead(unreadIds).subscribe({
        next: () => {
          this.chats.update((list) =>
            list.map((c) => (c.chatInternalId === chat.chatInternalId ? { ...c, unreadMessagesCount: 0, viewingStatus: 'VIEWED' } : c))
          );
        },
        error: (e) => console.error('Failed to mark messages read', e)
      });
    }
  }

  private fetchMessages(chatInternalId: number) {
    const size = 20;
    const collected: MessageDto[] = [];
    this.loadMessagesRecursive(chatInternalId, 0, size, collected);
  }

  private loadMessagesRecursive(chatInternalId: number, page: number, size: number, collected: MessageDto[]) {
    this.api.getMessages(chatInternalId, page, size).subscribe({
      next: (resp) => {
        const msgs = resp.page ?? [];
        collected.push(...msgs);

        if (page + 1 < resp.totalPages) {
          this.loadMessagesRecursive(chatInternalId, page + 1, size, collected);
          return;
        }

        this.handleMessagesLoaded(chatInternalId, collected);
      },
      error: (e) => console.error('Failed to fetch messages:', e)
    });
  }

  private handleMessagesLoaded(chatInternalId: number, collected: MessageDto[]) {
    const sel = this.selectedChat();
    if (!sel) {
      return;
    }

    const newest = collected[0];
    sel.viewingStatus = normalizeViewingStatus(newest?.messageViewingStatus) || undefined;

    sel.messages = collected
      .map<ChatMessageView>((msg) => ({
        id: msg.id,
        from: msg.fromManager ? 'Me' : sel.nickname,
        text: msg.text,
        time: formatTimeOrDate(msg.sendAt),
        images: (msg.assets ?? []).filter((a) => a.type === 'IMAGE').map((a) => a.url),
        fileName: (msg.assets ?? []).find((a) => a.type === 'FILE')?.fileName,
        fileUrl: (msg.assets ?? []).find((a) => a.type === 'FILE')?.url,
        viewingStatus: normalizeViewingStatus(msg.messageViewingStatus)
      }))
      .reverse();

    this.markUnreadMessagesAsRead(sel);
  }

  private markUnreadMessagesAsRead(sel: ChatListItem) {
    const unreadIds = sel.messages
      .filter((m) => m.viewingStatus === 'UNREAD')
      .map((m) => m.id)
      .filter(Boolean);

    if (unreadIds.length === 0) {
      return;
    }

    this.api.markMessagesRead(unreadIds).subscribe({
      next: () => {
        this.chats.update((list) =>
          list.map((c) => (c.chatInternalId === sel.chatInternalId ? { ...c, unreadMessagesCount: 0, viewingStatus: 'VIEWED' } : c))
        );
      },
      error: (e) => console.error('Failed to mark messages read', e)
    });
  }

  sendMessage(text: string, file?: File) {
    const sel = this.selectedChat();
    if (!sel || (!text.trim() && !file)) {
      return;
    }

    this.api.sendMessage(sel.chatInternalId, text.trim(), file).subscribe({
      next: () => {
        const time = formatTimeOrDate(new Date().toISOString());
        const imagePreview = file ? URL.createObjectURL(file) : null;

        sel.messages.push({
          from: 'Me',
          text: text.trim(),
          time,
          images: imagePreview ? [imagePreview] : [],
          viewingStatus: null
        });
        sel.lastMessage = text.trim();
        sel.time = time;

        this.selectedChat.set({ ...sel });
      },
      error: (e) => console.error('Failed to send message:', e)
    });
  }

  toggleClientInfo() {
    this.clientInfoVisible.update((v) => !v);
    const visible = this.clientInfoVisible();
    const sel = this.selectedChat();
    if (visible && sel) {
      this.clientInfoData.set(null);
      this.api.getLastOrder(sel.chatInternalId).subscribe({
        next: (res) => this.clientInfoData.set({ ...res, chatId: sel.chatInternalId } as any),
        error: (err: { status?: number }) => {
          const key = err?.status === 404 ? 'client-panel.no-orders' : 'client-panel.error';
          this.clientInfoData.set({ error: key, chatId: sel.chatInternalId } as any);
          console.error('Failed to load client info:', err);
        }
      });
    }
  }

  private ensureTileSocket(chatId: number) {
    if (this.tileSubs.has(chatId)) {
      return;
    }

    const sub = this.socket.subscribeToMessages(chatId).subscribe((m) => {
      if (this.currentChatId === chatId) {
        return;
      }

      const norm = normalizeViewingStatus(m.messageViewingStatus);

      this.chats.update((list) => {
        const idx = list.findIndex((c) => c.chatInternalId === chatId);
        if (idx === -1) {
          return list;
        }

        const updated: ChatListItem = {
          ...list[idx],
          lastMessage: m.text ?? '',
          time: toTime(m.sendAt),
          viewingStatus: norm || list[idx].viewingStatus,
          unreadMessagesCount: (list[idx].unreadMessagesCount ?? 0) + 1
        };

        const copy = [...list];
        copy.splice(idx, 1);
        copy.unshift(updated);
        return copy;
      });
    });

    this.tileSubs.set(chatId, sub);
  }

  setSearchId(v: string) {
    this.searchId.set(v);
  }
  openImageModal(url: string) {
    this.selectedImageUrl.set(url);
  }
  closeImageModal() {
    this.selectedImageUrl.set(null);
  }
}
