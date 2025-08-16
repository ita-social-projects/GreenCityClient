import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [NgIf, FormsModule, TranslateModule],
  templateUrl: './message-input.component.html'
})
export class MessageInputComponent {
  @Output() sendText = new EventEmitter<{ text: string; file?: File }>();

  text = '';
  file?: File;

  send() {
    if (!this.text.trim() && !this.file) return;
    this.sendText.emit({ text: this.text, file: this.file });
    this.text = '';
    this.file = undefined;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 5) {
      alert('File is too large. Max size is 5MB.');
      return;
    }
    this.file = file;
  }
}
