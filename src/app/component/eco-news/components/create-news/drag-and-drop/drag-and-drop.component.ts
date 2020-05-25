import { Component, OnInit } from '@angular/core';
import { FileHandle } from '../../../models/create-news-interface';
import { CreateEcoNewsService } from '../../../services/create-eco-news.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

  constructor(private createEcoNewsService: CreateEcoNewsService ) { }

  private imageChangedEvent: FileHandle[];
  private isCropper: boolean = true;
  private extentionWarning: boolean = false;
  public files: FileHandle[] = [];
  public isWarning: boolean = false;

  private stopCropping(): void {
    this.isCropper = false;
  }

  private cancelChanges(): void {
    this.isCropper = false;
  }

  private imageCropped(event: ImageCroppedEvent): void {
    this.files.forEach(item => {
      item.url = event.base64;
    })  
  }

  public filesDropped(files: FileHandle[]): void {
    this.files = files;
    this.createEcoNewsService.files = files;
    this.showWarning();
    this.createEcoNewsService.isImageValid = this.isWarning;
  }

  public showWarning(): void {
    this.files.forEach(item => {
      if (item &&
        item.file.size < 10485760 &&
        (item.file.type === 'image/jpeg' || item.file.type === 'image/png')) {
        this.isWarning = false;
      } else {
        this.isWarning = true;
      }
    })
  }

  public showExtentionWarning(): void {
    this.files.forEach(item => {
      if (item && 
        item.file.type === 'image/jpeg' || item.file.type === 'image/png') {
        this.extentionWarning = false;
      } else {
        this.extentionWarning = true;
      }
    })
  }

  ngOnInit() {
  }
}

