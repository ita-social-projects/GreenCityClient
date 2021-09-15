import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

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
  public isNotification: boolean;
  public loadingAnim: boolean;
  private croppedImage: string;
  private maxImageSize = 10485760;

  constructor(
    private matDialogRef: MatDialogRef<EditPhotoPopUpComponent>,
    private dialog: MatDialog,
    private editProfileService: EditProfileService,
    private profileService: ProfileService,
    private snackBar: MatSnackBarComponent,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.setUserAvatar();
  }

  public openFilesWindow(elem: HTMLLabelElement) {
    elem.click();
  }

  public onSelectPhoto(event): void {
    const imageFile = event.target.files[0];
    this.isWarning = this.showWarning(imageFile);

    if (!this.isWarning) {
      this.selectedFile = imageFile as File;
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (ev) => this.handleFile(ev);
    }
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  public savePhoto(): void {
    this.loadingAnim = true;
    const formData = new FormData();
    formData.append('base64', this.croppedImage);
    this.editProfileService.updateProfilePhoto(formData).subscribe(
      () => {
        this.loadingAnim = false;
        this.closeEditPhoto();
      },
      () => {
        this.loadingAnim = false;
        this.openErrorDialog();
      }
    );
  }

  public deletePhoto(): void {
    this.loadingAnim = true;
    this.editProfileService.deleProfilePhoto().subscribe(
      () => {
        this.loadingAnim = false;
        this.closeEditPhoto();
      },
      () => {
        this.loadingAnim = false;
        this.openErrorDialog();
      }
    );
  }

  public closeEditPhoto(): void {
    this.matDialogRef.close();
  }

  private setUserAvatar() {
    this.avatarImg = this.data.img;
  }

  private handleFile(event): void {
    this.selectedFileUrl = event.target.result;
    this.files[0] = { url: this.selectedFileUrl, file: this.selectedFile };
    if (!this.isWarning && typeof this.selectedFile !== 'undefined') {
      this.selectedPhoto = !this.isWarning ? true : this.selectedPhoto;
    }
  }

  private showWarning(file): boolean {
    return file.size > this.maxImageSize || (file.type !== 'image/jpeg' && file.type !== 'image/png');
  }

  private openErrorDialog(): void {
    this.snackBar.openSnackBar('error');
  }
}
