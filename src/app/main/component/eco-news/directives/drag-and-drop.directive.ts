import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '@eco-news-models/create-news-interface';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) {}

  @HostBinding('style.opacity') public opacity = '1';

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    this.opacity = '0.7';
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    const files: FileHandle[] = [];
    for (const file of Array.from(evt.dataTransfer.files)) {
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({ file, url });
    }

    if (files.length > 0) {
      this.files.emit(files);
    }

    const reader: FileReader = new FileReader();
    files.forEach((item) => {
      reader.readAsDataURL(item.file);
    });
    reader.onload = handleFile.bind(this);

    function handleFile(event): void {
      const binaryString = event.target.result;
      files.forEach((item) => {
        item.url = binaryString;
      });
    }
  }
}
