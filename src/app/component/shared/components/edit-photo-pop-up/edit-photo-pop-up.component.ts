import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { ErrorComponent } from '@global-errors/error/error.component';
import { FileHandle } from '@eco-news-models/create-news-interface';

@Component({
  selector: 'app-edit-photo-pop-up',
  templateUrl: './edit-photo-pop-up.component.html',
  styleUrls: ['./edit-photo-pop-up.component.scss']
})
export class EditPhotoPopUpComponent implements OnInit {
  public avatarImg: string;
  public cancelButton = './assets/img/profile/icons/cancel.svg';
  public files: FileHandle[] = [];
  public isWarning = false;
  public selectedPhoto = false;
  public selectedFile: File = null;
  public selectedFileUrl: string;
  private croppedImage: string;

  constructor(private matDialogRef: MatDialogRef<EditPhotoPopUpComponent>,
              private dialog: MatDialog,
              private editProfileService: EditProfileService,
              private profileService: ProfileService,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.setUserAvatar();
  }

  private setUserAvatar() {
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
    this.selectedFileUrl = event.target.result;
    this.files[0] = { url: this.selectedFileUrl, file: this.selectedFile };
    if (!this.isWarning && typeof this.selectedFile !== 'undefined') {
      this.showWarning();
      this.selectedPhoto = !this.isWarning ? true : this.selectedPhoto;
    }
  }

  public showWarning(): void {
    const imageVal = this.files.filter(item => item.file.type === 'image/jpeg' || item.file.type === 'image/png');
    this.isWarning = imageVal.length < 1;
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  public savePhoto(): void {
    this.files = this.files.map(item => ({...item, url: this.croppedImage}));

    const body = {
      id: this.profileService.userId,
      profilePicturePath: this.croppedImage
    };
    const formData = new FormData();
    formData.append('userProfilePictureDto', JSON.stringify(body));

    this.editProfileService.updateProfilePhoto(formData)
    .subscribe(
     () => this.matDialogRef.close(),
     () => this.dialog.open(ErrorComponent, {
       hasBackdrop: false,
       closeOnNavigation: true,
       position: { top: '100px' },
       panelClass: 'custom-dialog-container',
     })
   );
  }
}
