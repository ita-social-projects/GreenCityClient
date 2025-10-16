import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CHAT_ICONS } from '../../chat-icons';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule, TranslateModule, NgIf],
  templateUrl: './message-input.component.html'
})
export class MessageInputComponent implements OnChanges {
  @Output() sendText = new EventEmitter<{ text: string; file?: File }>();
  @Output() closeEdit = new EventEmitter();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;
  @Input() editText?: string;
  text = '';
  file?: File;
  private readonly MAX_FILE_MB = 5;
  readonly chatICons = CHAT_ICONS;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editText']?.currentValue) {
      this.text = this.editText ?? '';
      this.textInput.nativeElement.focus();
    }
  }

  send() {
    if (!this.text.trim() && !this.file) {
      return;
    }
    this.sendText.emit({ text: this.text, file: this.file });
    this.text = '';
    this.editText = '';
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

  onClose() {
    this.closeEdit.emit();
    this.editText = '';
    this.text = '';
  }
}
