import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { FileHandle } from '@eco-news-models/create-news-interface';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  public selectedFile: File = null;
  public selectedFileUrl: string;
  public imageChangedEvent: FileHandle[];
  public isCropper = true;
  public files: FileHandle[] = [];
  public isWarning = false;
  private croppedImage: string;
  @Input() public formData: FormGroup;

  constructor(private createEcoNewsService: CreateEcoNewsService ) {}

  ngOnInit() {
    this.patchImage();
  }

  public stopCropping(): FileHandle[] {
    this.files.map(item => item.url = this.croppedImage);

    this.isCropper = false;
    return this.files;
  }

  public cancelChanges(): void {
    this.isCropper = false;
  }

  public patchImage(): void {
    if (this.createEcoNewsService.isBackToEditing) {
      this.isCropper = false;
      this.files = [{file: name, url: this.formData.value.image}];
    }
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  public filesDropped(files: FileHandle[]): void {
    this.files = files;
    this.createEcoNewsService.files = files;
    this.isCropper = true;
    this.showWarning();
    this.createEcoNewsService.isImageValid = this.isWarning;
  }

  public onFileSelected(event): void {
    this.selectedFile = event.target.files[0] as File;

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (ev) => this.handleFile(ev);

    this.createEcoNewsService.files = this.files;
  }

  private handleFile(event): void {
    const binaryString = event.target.result;
    this.selectedFileUrl = binaryString;
    this.files[0] = {url: this.selectedFileUrl, file: this.selectedFile};
    this.showWarning();
    this.createEcoNewsService.fileUrl = this.selectedFileUrl;
   }

  public showWarning(): FileHandle[] {
    this.files.map(item => {
      const imageValCondition = item.file.type === 'image/jpeg' || item.file.type === 'image/png';
      this.isWarning = !(item && imageValCondition);
    });
    return this.files;
  }
}

