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
  selectedFile: File | null = null;
  caption = '';
  photoUrl: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUnauthorizedUsers();
    this.loadAuthorizedUsers();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }
  sendUploadedPhoto(photoUrl: string): void {
    if (!this.selectedChat || !photoUrl.trim()) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const chatId = this.selectedChat.chatId;
    const url =
      `http://localhost:8055/ubs/telegram/send-photo/${chatId}` +
      `?photoUrl=${encodeURIComponent(photoUrl)}` +
      `&caption=${encodeURIComponent(this.caption)}`;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(url, null, { headers, responseType: 'text' }).subscribe({
      next: () => {
        alert('Photo with URL sent!');
        this.caption = '';
      },
      error: (err) => {
        console.error('Failed to send photo by URL:', err);
      }
    });
  }
  loadAuthorizedUsers(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = {
      page: 0,
      size: 50,
      sort: ['id,asc'] // optional sort field
    };

    const url = `http://localhost:8055/ubs/telegram/get-all-authorized-users`;

    this.http.get<any>(url, { headers, params }).subscribe({
      next: (response) => {
        const users = response.page || [];

        const authorizedChats = users.map((user: any) => ({
          name: user.chatId,
          initial: user.chatId[0]?.toUpperCase() || '?',
          chatId: user.chatId,
          lastMessage: '',
          time: '',
          messages: [],
          isAuthorized: true
        }));

        this.chats.push(...authorizedChats);
      },
      error: (err) => {
        console.error('Failed to load authorized users:', err);
      }
    });
  }

  uploadPhoto(): void {
    if (!this.selectedChat || !this.selectedFile) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const chatId = this.selectedChat.chatId;
    const url = `http://localhost:8055/ubs/telegram/upload-photo/${chatId}?caption=${encodeURIComponent(this.caption)}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(url, formData, { headers }).subscribe({
      next: () => {
        this.caption = '';
        this.selectedFile = null;
        alert('Photo sent!');
      },
      error: (err) => {
        console.error('Failed to upload photo:', err);
      }
    });
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
