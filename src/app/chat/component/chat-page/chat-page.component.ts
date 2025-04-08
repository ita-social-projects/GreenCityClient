import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-page.component.html',
  standalone: true,
  imports: [NgForOf, FormsModule, NgClass, NgIf],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent {
  chats = [
    {
      name: 'Alex Morgan',
      initial: 'A',
      lastMessage: 'Lorem ipsum dolor sit amet.',
      time: '9:31 AM',
      messages: [
        { from: 'Alex', text: 'Lorem ipsum dolor sit amet.', time: '9:30 AM' },
        { from: 'Me', text: 'Consectetur adipiscing elit.', time: '9:31 AM' }
      ]
    },
    {
      name: 'Emily Stone',
      initial: 'E',
      lastMessage: 'Vestibulum ante ipsum primis.',
      time: '11:13 AM',
      messages: [
        { from: 'Emily', text: 'Vestibulum ante ipsum primis.', time: '11:11 AM' },
        { from: 'Me', text: 'In faucibus orci luctus et ultrices.', time: '11:12 AM' }
      ]
    }
  ];

  selectedChat: any = null;
  newMessage = '';

  selectChat(chat: any): void {
    console.log('Selected:', chat.name);
    this.selectedChat = chat;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedChat) {
      return;
    }

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
  }
}
