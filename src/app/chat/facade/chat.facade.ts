import { Injectable, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatApiService } from '../data/chat-api.service';
import { ChatListItem, ChatDto, MessageDto, ChatMessageView, ClientInfoData } from '../model/chat-page.interface';
import { buildName, normalizeViewingStatus, toTime } from '../utils/chat-mappers';
import { map, mergeMap, of, Subscription } from 'rxjs';
import { TelegramSocketService } from '../service/chats/telegram-socket.service';

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

  readonly filteredChats = computed(() => {
    const q = this.searchId().trim();
    if (!q) {
      return this.chats();
    }
    return this.chats().filter((c) => c.chatInternalId.toString().includes(q));
  });

  private destroyRef = inject(DestroyRef);
  private tileSubs = new Map<number, Subscription>();
  private currentChatId?: number;
  private messagesSub?: Subscription;

  constructor(
    private api: ChatApiService,
    private socket: TelegramSocketService
  ) {
    this.socket.newChats$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((nc) => {
      const internalId =
        'id' in nc
          ? nc.id
          : 'chatInternalId' in nc
            ? nc.chatInternalId
            : 'internalId' in nc
              ? nc.internalId
              : (() => {
                  throw new Error('SocketNewChat payload missing internal id.');
                })();

      const chatIdStr = String(nc.chatId);
      const { name, initial } = buildName(nc.username ?? null, nc.firstName ?? null, nc.lastName ?? null, chatIdStr);

      const item: ChatListItem = {
        name,
        initial,
        chatId: chatIdStr,
        chatInternalId: internalId,
        lastMessage: nc.lastMessage?.text ?? '',
        time: nc.lastMessage?.sendAt ? toTime(nc.lastMessage.sendAt) : '',
        messages: [],
        viewingStatus: normalizeViewingStatus(nc.lastMessage?.messageViewingStatus) || undefined
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
          const { name, initial } = buildName(chat.username, chat.firstName, chat.lastName, chat.chatId);
          return {
            name,
            initial,
            chatId: chat.chatId,
            chatInternalId: chat.id,
            lastMessage: chat.lastMessage?.text ?? '',
            time: chat.lastMessage?.sendAt ? toTime(chat.lastMessage.sendAt) : '',
            messages: [],
            viewingStatus: normalizeViewingStatus(chat.lastMessage?.messageViewingStatus) || undefined
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

        if (page === 0 && initialSelectedChatId != null) {
          const found = this.chats().find((c) => c.chatInternalId === initialSelectedChatId);
          if (found) {
            this.selectChat(found);
          }
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  selectChat(chat: ChatListItem) {
    if (this.currentChatId === chat.chatInternalId) {
      return;
    }

    if (this.currentChatId != null) {
      this.socket.unsubscribeFromChat(this.currentChatId);
      this.messagesSub?.unsubscribe();
    }

    this.currentChatId = chat.chatInternalId;

    this.selectedChat.set(chat);
    this.clientInfoVisible.set(false);
    this.clientInfoData.set(null);

    this.messagesSub = this.socket.subscribeToMessages(chat.chatInternalId).subscribe((m) => {
      const norm = normalizeViewingStatus(m.messageViewingStatus);
      const current = this.selectedChat();
      if (!current) {
        return;
      }

      current.messages.push({
        from: m.fromManager ? 'Me' : current.name,
        text: m.text,
        time: toTime(m.sendAt),
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
        if (norm === 'VIEWED' && current.messages.length) {
          const last = current.messages[current.messages.length - 1];
          if (last.from === 'Me') {
            last.viewingStatus = 'VIEWED';
          }
        }
        this.chats.set([...this.chats()]);
      }

      this.selectedChat.set({ ...current });
    });

    this.fetchMessages(chat.chatInternalId);
  }

  private fetchMessages(chatInternalId: number) {
    const size = 20;
    const collected: MessageDto[] = [];

    const load = (page: number) => {
      this.api.getMessages(chatInternalId, page, size).subscribe({
        next: (resp) => {
          const msgs = resp.page ?? [];
          collected.push(...msgs);

          if (page + 1 < resp.totalPages) {
            load(page + 1);
          } else {
            const sel = this.selectedChat();
            if (!sel) {
              return;
            }

            const newest = collected[0];
            sel.viewingStatus = normalizeViewingStatus(newest?.messageViewingStatus) || undefined;

            sel.messages = collected
              .map<ChatMessageView>((msg) => ({
                from: msg.fromManager ? 'Me' : sel.name,
                text: msg.text,
                time: toTime(msg.sendAt),
                images: (msg.assets ?? []).filter((a) => a.type === 'IMAGE').map((a) => a.url),
                viewingStatus: normalizeViewingStatus(msg.messageViewingStatus)
              }))
              .reverse();

            this.selectedChat.set({ ...sel });
          }
        },
        error: (e) => console.error('Failed to fetch messages:', e)
      });
    };
    load(0);
  }

  sendMessage(text: string, file?: File) {
    const sel = this.selectedChat();
    if (!sel || (!text.trim() && !file)) {
      return;
    }

    this.api.sendMessage(sel.chatInternalId, text.trim(), file).subscribe({
      next: () => {
        const time = toTime(new Date().toISOString());
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
        next: (res) => this.clientInfoData.set(res),
        error: (err: { status?: number }) => {
          const key = err?.status === 404 ? 'client-panel.no-orders' : 'client-panel.error';
          this.clientInfoData.set({ error: key } as any);
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

        const updated = { ...list[idx], lastMessage: m.text, time: toTime(m.sendAt) };
        if (norm) {
          updated.viewingStatus = norm;
        }

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
