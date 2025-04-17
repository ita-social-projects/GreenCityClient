import { Component } from '@angular/core';
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
export class ChatComponent {
  chats = [
    {
      name: 'Pickup User',
      initial: 'P',
      chatId: '6941601046',
      lastMessage: '',
      time: '',
      messages: []
    }
  ];

  selectedChat: any = null;
  newMessage = '';

  constructor(private http: HttpClient) {}

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
    const url = `http://localhost:8055/ubs/telegram/user-messages/${chatId}?page=0&size=10`;

    this.http.get<any[]>(url, { headers }).subscribe((response) => {
      this.selectedChat.messages = response.map((msg) => ({
        from: msg.isManagerMessage ? 'Me' : this.selectedChat.name,
        text: msg.text,
        time: new Date(msg.sendAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    });
  }

  sendMessage(): void {
    console.log('Send button clicked');
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

    this.http.post(url, null, { headers }).subscribe({
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
