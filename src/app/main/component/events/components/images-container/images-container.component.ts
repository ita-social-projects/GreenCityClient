import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FileHandle } from 'src/app/ubs/ubs-admin/models/file-handle.model';

@Component({
  selector: 'app-images-container',
  templateUrl: './images-container.component.html',
  styleUrls: ['./images-container.component.scss']
})
export class ImagesContainerComponent implements OnInit {
  private isImageTypeError = false;
  private dragAndDropLabel = 'Drag Image';
  private imgArray = [];

  public images = [];

  @ViewChild('takeInput') InputVar: ElementRef;

  @Output() imgArrayOutput = new EventEmitter<Array<File>>();

  constructor() {}

  ngOnInit(): void {
    this.initImages();
  }

  private initImages(): void {
    for (let i = 0; i < 5; i++) {
      this.images.push({ src: null, label: this.dragAndDropLabel, isLabel: false });
    }
    this.images[0].isLabel = true;
  }

  public filesDropped(files: FileHandle[]): void {
    // this.checkFileExtension(files);
    const imageFile = files[0].file;
    this.transferFile(imageFile);
  }

  private transferFile(imageFile: File): void {
    if (!this.isImageTypeError) {
      const reader: FileReader = new FileReader();
      this.imgArray.push(imageFile);
      this.imgArrayOutput.emit(this.imgArray);

      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        this.assignImage(reader.result);
      };
    }
  }

  private assignImage(result: any): void {
    for (let i = 0; i < this.images.length; i++) {
      if (!this.images[i].src) {
        this.images[i].src = result;
        this.images[i + 1].isLabel = true;
        this.images[i].isLabel = false;
        break;
      }
    }
  }

  public deleteImage(i: number): void {
    this.images.splice(i, 1);
    this.imgArray.splice(i, 1);
    this.imgArrayOutput.emit(this.imgArray);
    this.images.push({ src: null, label: this.dragAndDropLabel, isLabel: false });
  }

  public loadFile(event: Event): void {
    const imageFile: File = (event.target as HTMLInputElement).files[0];
    this.InputVar.nativeElement.value = '';
    this.transferFile(imageFile);
  }
}
