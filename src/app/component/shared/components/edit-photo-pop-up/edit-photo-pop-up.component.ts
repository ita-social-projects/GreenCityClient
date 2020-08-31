import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-photo-pop-up',
  templateUrl: './edit-photo-pop-up.component.html',
  styleUrls: ['./edit-photo-pop-up.component.scss']
})
export class EditPhotoPopUpComponent implements OnInit {
  public avatarImg: string;
  public cancelButton = './assets/img/profile/icons/cancel.svg';
  public selectPhoto = false;
  public selectedFile: File = null;
  public selectedFileUrl: string;
  public files: FileHandle[] = [];
  public isCropper = true;
  private croppedImage: string;

  constructor(private matDialogRef: MatDialogRef<EditPhotoPopUpComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.setuserAvatar();
  }

  private setuserAvatar() {
    this.avatarImg = this.data.img;
  }

  public closeEditPhoto(): void {
    this.matDialogRef.close();
  }

  public onSelectPhoto(event): void {
    this.selectedFile = event.target.files[0] as File;
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (ev) => this.handleFile(ev);
    if (typeof this.selectedFile !== 'undefined') {
      this.selectPhoto = true;
    }
  }

  private handleFile(event): void {
    const binaryString = event.target.result;
    this.selectedFileUrl = binaryString;
    this.files[0] = { url: this.selectedFileUrl, file: this.selectedFile };
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }
}
