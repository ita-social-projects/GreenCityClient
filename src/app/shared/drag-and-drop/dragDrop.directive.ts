import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../../ubs-admin/models/file-handle.model';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();

  @HostBinding('style.background') public background = '#F7F9FA';

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#F7F9FA';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#F7F9FA';

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
}
