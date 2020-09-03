import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from '../../../../component/errors/error/error.component';

@Component({
  selector: 'app-edit-photo-pop-up',
  templateUrl: './edit-photo-pop-up.component.html',
  styleUrls: ['./edit-photo-pop-up.component.scss']
})
export class EditPhotoPopUpComponent implements OnInit {
  public avatarImg: string;
  public cancelButton = './assets/img/profile/icons/cancel.svg';
  public selectedPhoto = false;
  public selectedFile: File = null;
  public selectedFileUrl: string;
  public files: FileHandle[] = [];
  public isWarning = false;
  private croppedImage: string;
  private userId: number;

  constructor(private matDialogRef: MatDialogRef<EditPhotoPopUpComponent>,
              private router: Router,
              private dialog: MatDialog,
              private editProfileService: EditProfileService,
              private profileService: ProfileService,
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
    this.isWarning = false;
    this.selectedFile = event.target.files[0] as File;
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (ev) => this.handleFile(ev);
  }

  private handleFile(event): void {
    const binaryString = event.target.result;
    this.selectedFileUrl = binaryString;
    this.files[0] = { url: this.selectedFileUrl, file: this.selectedFile };
    if (!this.isWarning && typeof this.selectedFile !== 'undefined') {
      this.showWarning();
      if (!this.isWarning) {
        this.selectedPhoto = true;
      }
    }
  }

  public showWarning(): void {
    const imageVal = this.files.filter(item => item.file.type === 'image/jpeg' || item.file.type === 'image/png');
    if(imageVal.length !== 1) {
      this.isWarning = true;
    }
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  public savePhoto(): void {
    this.files.map(item => item.url = this.croppedImage);
    this.userId = this.profileService.userId;
    this.editProfileService.files = this.files;

    //console.log(this.files[0].url)
    this.editProfileService.patchUsersPhoto(this.userId, this.croppedImage)
    .subscribe(
     (succeed) => this.matDialogRef.close(),
     (error) => this.dialog.open(ErrorComponent, {
       hasBackdrop: false,
       closeOnNavigation: true,
       position: { top: '100px' },
       panelClass: 'custom-dialog-container',
     })
   );
  }
}
