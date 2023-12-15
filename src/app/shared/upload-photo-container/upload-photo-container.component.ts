import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-photo-container',
  templateUrl: './upload-photo-container.component.html',
  styleUrls: ['./upload-photo-container.component.scss']
})
export class UploadPhotoContainerComponent implements OnInit {
  public isHorisontalImg: boolean;
  private croppedImage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<UploadPhotoContainerComponent>
  ) {}

  ngOnInit(): void {
    const img = new Image();
    img.src = this.data.file.url;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      this.isHorisontalImg = height >= width;
    };
  }

  getMainContainerStyle(): { height: string; width: string } {
    return {
      height: this.isHorisontalImg ? '700px' : '530px',
      width: this.isHorisontalImg ? '500px' : '630px'
    };
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  onSaveChanges(): void {
    this.dialogRef.close(this.croppedImage);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
