import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageService } from '@global-service/image/image.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-image-pop-up',
  templateUrl: './edit-image-pop-up.component.html',
  styleUrls: ['./edit-image-pop-up.component.scss']
})
export class EditImagePopUpComponent implements OnInit {
  imageFile: File;
  isLoading = true;

  private croppedImage: Blob;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditImagePopUpComponent>,
    private imageService: ImageService
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    if (!this.data.image) {
      this.onCancel();
      return;
    }

    this.initImage();
  }

  onImageCropped(event: ImageCroppedEvent): void {
    if (!event.blob) {
      return;
    }

    this.croppedImage = event.blob;
  }

  onSave(): void {
    const image = new File([this.croppedImage], this.data.image.name, { type: 'image/png' });
    this.dialogRef.close({ index: this.data.index, croppedImage: image });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private initImage(): void {
    this.imageFile = this.data.image?.file;

    if (this.imageFile) {
      this.isLoading = false;
      return;
    }

    this.loadImage();
  }

  private loadImage(): void {
    this.imageService.loadImageAsFile(this.data.image.url, 'image/jpeg').subscribe((image: File) => {
      this.imageFile = image;
      this.isLoading = false;
    });
  }
}
