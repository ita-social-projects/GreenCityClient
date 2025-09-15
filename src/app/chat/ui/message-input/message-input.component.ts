import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './message-input.component.html'
})
export class MessageInputComponent implements OnInit {
  @Output() sendText = new EventEmitter<{ text: string; file?: File }>();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @Input() editText: string;
  text = '';
  file?: File;
  private readonly MAX_FILE_MB = 5;

  ngOnInit() {
    if (this.editText) {
      this.text = this.editText;
    }
  }

  send() {
    if (!this.text.trim() && !this.file) {
      return;
    }
    this.sendText.emit({ text: this.text, file: this.file });
    this.text = '';
    this.file = undefined;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > this.MAX_FILE_MB) {
      this.file = undefined;
      input.value = '';
      return;
    }
    this.file = file;
  }
}
