import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-photo-container',
  templateUrl: './upload-photo-container.component.html',
  styleUrls: ['./upload-photo-container.component.scss']
})
export class UploadPhotoContainerComponent implements OnInit {
  public isHorisontalImg: boolean;
  croppedImage;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<UploadPhotoContainerComponent>) {}

  ngOnInit(): void {
    const img = new Image();
    img.src = this.data.file.url;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      this.isHorisontalImg = height >= width;
    };
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSaveChanges(): void {
    this.dialogRef.close(this.croppedImage);
  }
}
