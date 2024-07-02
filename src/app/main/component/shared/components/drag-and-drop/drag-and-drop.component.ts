import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FileHandle } from '@eco-news-models/create-news-interface';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent {
  selectedFile: File = null;
  selectedFileUrl: string;
  imageChangedEvent: FileHandle[];
  isCropper = true;
  isWarning = false;
  croppedImage: ImageCroppedEvent;
  @Input() file: FileHandle;
  @Output() newFile = new EventEmitter<FileHandle>();

  stopCropping(): void {
    const changeFile = new File([this.croppedImage.blob], this.file.file.name, { type: 'image/png' });

    const reader = new FileReader();
    reader.readAsDataURL(changeFile);
    reader.onloadend = () => {
      const base64data = reader.result;

      this.file = {
        url: base64data,
        file: changeFile
      };
      this.isCropper = false;
      this.newFile.emit(this.file);
      this.isWarning = false;
    };
  }

  cancelChanges(): void {
    this.file = null;
    this.isCropper = true;
    this.croppedImage = null;
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.newFile.emit(this.file);
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event;
  }

  filesDropped(files: FileHandle[]): void {
    this.file = files[0];
    this.isCropper = true;
    this.showWarning();
  }

  onFileSelected(event): void {
    this.selectedFile = event.target.files[0] as File;
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (ev) => this.handleFile(ev);
  }

  private handleFile(event): void {
    const binaryString = event.target.result;
    this.selectedFileUrl = binaryString;
    this.file = { url: this.selectedFileUrl, file: this.selectedFile };
    this.showWarning();
  }

  showWarning(): void {
    this.isWarning = !((this.file.file.type === 'image/jpeg' || this.file.file.type === 'image/png') && this.file.file.size < 10485760);
    if (this.isWarning) {
      this.file = null;
    } else {
      this.newFile.emit(this.file);
    }
  }
}
