import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-page.component.html',
  standalone: true,
  imports: [NgForOf, FormsModule, NgClass, NgIf, HttpClientModule],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent implements OnInit {
  chats: any[] = [];
  selectedChat: any = null;
  newMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUnauthorizedUsers();
  }

  loadUnauthorizedUsers(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8055/ubs/telegram/get-all-unauthorized-users`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        const users = response.page || [];

        this.chats = users.map((user: any) => ({
          name: user.userName || `${user.firstName} ${user.lastName}`.trim() || 'Unknown',
          initial: (user.userName || user.firstName || '?')[0].toUpperCase(),
          chatId: user.chatId,
          lastMessage: '',
          time: '',
          messages: []
        }));
      },
      error: (error) => {
        console.error('Failed to load unauthorized users:', error);
      }
    });
  }

  selectChat(chat: any): void {
    this.selectedChat = chat;
    this.fetchMessages(chat.chatId);
  }

  fetchMessages(chatId: string): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8055/ubs/telegram/user-messages/${chatId}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        const messages = response.page || [];
        this.selectedChat.messages = messages.map((msg: any) => ({
          from: msg.isManagerMessage ? 'Me' : this.selectedChat.name,
          text: msg.text,
          time: new Date(msg.sendAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message?.includes('no messages')) {
          this.selectedChat.messages = [];
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

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const chatId = this.selectedChat.chatId;
    const message = encodeURIComponent(this.newMessage.trim());
    const url = `http://localhost:8055/ubs/telegram/send-message/${chatId}?message=${message}`;

    this.http.post(url, null, { headers, responseType: 'text' }).subscribe({
      next: () => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.selectedChat.messages.push({
          from: 'Me',
          text: this.newMessage.trim(),
          time
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
}
