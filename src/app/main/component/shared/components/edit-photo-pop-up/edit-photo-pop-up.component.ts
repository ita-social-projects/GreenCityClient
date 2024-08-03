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
  avatarImg: string;
  cancelButton = './assets/img/profile/icons/cancel.svg';
  files: FileHandle[] = [];
  isWarning = false;
  selectedPhoto = false;
  selectedFile: File = null;
  selectedFileUrl: string | ArrayBuffer;
  isNotification: boolean;
  loadingAnim: boolean;
  private croppedImage: string;
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

  openFilesWindow(event: KeyboardEvent) {
    if (event.code === 'Space' || event.code === 'Enter') {
      (event.target as HTMLInputElement).click();
    }
  }

  onSelectPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.transferFile(input.files[0]);
    }
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

  imageCropped(event: ImageCroppedEvent): void {
    if (event.blob) {
      this.convertBlobToBase64(event.blob)
        .then((base64) => {
          this.croppedImage = base64;
        })
        .catch((err) => {
          console.error('Failed to convert to base64:', err);
        });
    } else {
      console.error('No data available.');
    }
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  savePhoto(): void {
    this.loadingAnim = true;
    const formData = new FormData();
    formData.append('base64', this.croppedImage);
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
}
