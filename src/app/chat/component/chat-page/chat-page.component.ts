import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-page.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgForOf, FormsModule, NgClass, NgIf, HttpClientModule],
  styleUrls: ['./chat-page.component.scss']
})
export class ChatComponent {}
