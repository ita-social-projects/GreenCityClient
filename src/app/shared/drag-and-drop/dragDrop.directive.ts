import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../../ubs/ubs-admin/models/file-handle.model';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();
  color = {
    grey: '#999',
    white: '#F7F9FA'
  };

  @HostBinding('style.background') public background = this.color.white;

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    this.stopPropagation(evt, this.color.grey);
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    this.stopPropagation(evt, this.color.white);
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    this.stopPropagation(evt, this.color.white);
    const files: FileHandle[] = [];
    const droppedFiles = Array.from(evt.dataTransfer.files);
    for (const fileItem of droppedFiles) {
      const file = fileItem;
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({ file, url });
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }

  stopPropagation(evt: DragEvent, color: string): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = color;
  }
}
