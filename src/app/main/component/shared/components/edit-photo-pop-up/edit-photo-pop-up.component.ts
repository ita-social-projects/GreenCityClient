import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-edit-photo-pop-up',
  templateUrl: './edit-photo-pop-up.component.html',
  styleUrls: ['./edit-photo-pop-up.component.scss']
})
export class EditPhotoPopUpComponent implements OnInit {
  avatarImg: string;
  cancelButton = './assets/img/profile/icons/cancel.svg';
  files: FileHandle[] = [];
  isWarning = false;
  selectedPhoto = false;
  selectedFile: File = null;
  selectedFileUrl: string | ArrayBuffer;
  isNotification: boolean;
  loadingAnim: boolean;
  private croppedImage: File;
  private maxImageSize = 10485760;
  isDragAndDropMenu = false;

  constructor(
    private matDialogRef: MatDialogRef<EditPhotoPopUpComponent>,
    private editProfileService: EditProfileService,
    private snackBar: MatSnackBarComponent,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.setUserAvatar();
  }

  filesDropped(files: FileHandle[]): void {
    if (files.length) {
      this.transferFile(files[0].file);
    }
  }

  private transferFile(imageFile: File): void {
    if (!this.showWarning(imageFile)) {
      this.selectedFile = imageFile;
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (event: ProgressEvent<FileReader>) => this.handleFile(event);
    }
  }

  savePhoto(): void {
    this.loadingAnim = true;
    const formData = new FormData();
    this.transferFile(this.croppedImage);
    formData.append('image', this.selectedFile);
    this.editProfileService.updateProfilePhoto(formData).subscribe({
      next: () => {
        this.loadingAnim = false;
        this.closeEditPhoto();
      },
      error: () => {
        this.loadingAnim = false;
        this.openErrorDialog();
      }
    });
  }

  deletePhoto(): void {
    this.loadingAnim = true;
    this.editProfileService.deleteProfilePhoto().subscribe({
      next: () => {
        this.loadingAnim = false;
        this.closeEditPhoto();
      },
      error: () => {
        this.loadingAnim = false;
        this.openErrorDialog();
      }
    });
  }

  closeEditPhoto(): void {
    this.matDialogRef.close();
  }

  private setUserAvatar() {
    this.avatarImg = this.data.img;
  }

  private handleFile(event: ProgressEvent<FileReader>): void {
    this.selectedFileUrl = event.target?.result;
    if (this.selectedFile && !this.isWarning) {
      this.files[0] = { url: this.selectedFileUrl, file: this.selectedFile };
      this.selectedPhoto = true;
    }
  }

  private showWarning(file: File): boolean {
    return file.size > this.maxImageSize || (file.type !== 'image/jpeg' && file.type !== 'image/png');
  }

  private openErrorDialog(): void {
    this.snackBar.openSnackBar('error');
  }

  imageCropped(fileHandle: FileHandle): void {
    if (!fileHandle?.url) {
      return;
    }
    this.croppedImage = fileHandle.file;
  }
}
