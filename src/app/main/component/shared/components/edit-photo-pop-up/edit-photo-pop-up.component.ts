import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { EditProfileService } from '@global-user/services/edit-profile.service';
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
  public selectedFileUrl: string | ArrayBuffer;
  public isNotification: boolean;
  public loadingAnim: boolean;
  private croppedImage: string;
  private maxImageSize = 10485760;
  public isDragAndDropMenu = false;

  constructor(
    private matDialogRef: MatDialogRef<EditPhotoPopUpComponent>,
    private editProfileService: EditProfileService,
    private snackBar: MatSnackBarComponent,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.setUserAvatar();
  }

  public openFilesWindow(event: KeyboardEvent) {
    if (event.code === 'Space' || event.code === 'Enter') {
      (event.target as HTMLInputElement).click();
    }
  }

  public onSelectPhoto(event: Event): void {
    const imageFile = (event.target as HTMLInputElement).files[0];
    this.transferFile(imageFile);
  }

  public filesDropped(files: FileHandle[]): void {
    const imageFile = files[0].file;
    this.transferFile(imageFile);
  }

  private transferFile(imageFile: File): void {
    this.isWarning = this.showWarning(imageFile);

    if (!this.isWarning) {
      this.selectedFile = imageFile;
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

  private handleFile(event: Event): void {
    this.selectedFileUrl = (event.target as FileReader).result;
    this.files[0] = { url: this.selectedFileUrl, file: this.selectedFile };
    if (!this.isWarning && typeof this.selectedFile !== 'undefined') {
      this.selectedPhoto = !this.isWarning ? true : this.selectedPhoto;
    }
  }

  private showWarning(file: File): boolean {
    return file.size > this.maxImageSize || (file.type !== 'image/jpeg' && file.type !== 'image/png');
  }

  private openErrorDialog(): void {
    this.snackBar.openSnackBar('error');
  }
}
