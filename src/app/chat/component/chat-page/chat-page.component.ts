import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ClientInfoPanelComponent } from '../client-info-panel/client-info-panel.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-page.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgForOf, FormsModule, NgClass, NgIf, HttpClientModule, ClientInfoPanelComponent],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent implements OnInit {
  chats: any[] = [];
  selectedChat: any = null;
  newMessage = '';
  selectedFile: File | null = null;
  caption = '';
  clientInfoVisible = false;
  clientInfoData: any = null;
  private readonly baseUrl = 'https://greencity-ubs.greencity.cx.ua/ubs/telegram';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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
          const fullName = chat.firstName || chat.lastName ? `${chat.firstName || ''} ${chat.lastName || ''}`.trim() : '';
          const raw = chat.username || fullName || chat.chatId;
          const name = raw || 'Unknown';
          const initial = raw ? raw.charAt(0).toUpperCase() : '?';

          return {
            name,
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
      },
      error: (err) => {
        console.error('Failed to load chats:', err);
      }
    });
  }

  selectChat(chat: any): void {
    this.selectedChat = chat;
    this.fetchMessages(chat.chatInternalId);
  }

  fetchMessages(chatInternalId: number): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/messages/${chatInternalId}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        const messages = response.page || [];

        this.selectedChat.messages = messages.length
          ? messages.map((msg: any) => ({
              from: msg.fromManager ? 'Me' : this.selectedChat.name,
              text: msg.text,
              time: new Date(msg.sendAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              }),
              images: (msg.assets || []).filter((a: any) => a.type === 'IMAGE').map((a: any) => a.url)
            }))
          : [
              {
                from: 'System',
                text: 'There are no messages in this chat.',
                time: ''
              }
            ];
      },
      error: (err) => {
        if (err.status === 404 && err.error?.message?.includes('no messages')) {
          this.selectedChat.messages = [
            {
              from: 'System',
              text: err.error.message,
              time: ''
            }
          ];
        } else {
          console.error('Failed to fetch messages:', err);
        }
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedChat) {
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
    formData.append('data', JSON.stringify(messagePayload));

    this.http
      .post(url, formData, {
        headers,
        responseType: 'text' as 'json'
      })
      .subscribe({
        next: () => {
          const now = new Date();
          const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          this.selectedChat.messages.push({
            from: 'Me',
            text: this.newMessage.trim(),
            time,
            images: []
          });

          this.selectedChat.lastMessage = this.newMessage.trim();
          this.selectedChat.time = time;
          this.newMessage = '';
        },
        error: (err) => {
          console.error('Failed to send message:', err);
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  toggleClientInfo(): void {
    this.clientInfoVisible = !this.clientInfoVisible;

    if (this.clientInfoVisible && this.selectedChat?.chatId) {
      this.fetchClientInfo(this.selectedChat.id);
    }
  }

  fetchClientInfo(chatId: number): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/last-order?chatId=12`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.clientInfoData = response;
      },
      error: (err) => {
        console.error('Failed to load client info:', err);
        this.clientInfoData = { error: 'Не вдалося завантажити інформацію.' };
      }
    });
  }
}
