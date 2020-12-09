import { Component, Input, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mat-snack-bar',
  templateUrl: './mat-snack-bar.component.html',
  styleUrls: ['./mat-snack-bar.component.scss'],
  providers: [TranslateService]
})
export class MatSnackBarComponent {
  public message: string;
  public className: string;
  public snackType = {
    error: () => {
      this.getSnackBarMessage('snack-bar.error.default');
      this.className = 'error-snackbar';
    },
    attention: () => {
      this.getSnackBarMessage('snack-bar.attention.default');
      this.className = 'attention-snackbar';
    },
    success: () => {
      this.getSnackBarMessage('snack-bar.success.default');
      this.className = 'success-snackbar';
    },
    exitConfirmRestorePassword: () => {
      this.getSnackBarMessage('snack-bar.attention.exit-confirm-restore-password');
      this.className = 'attention-snackbar';
    },
    successRestorePassword: () => {
      this.getSnackBarMessage('snack-bar.success.restore-password');
      this.className = 'success-snackbar';
    },
    successConfirmPassword: () => {
      this.getSnackBarMessage('snack-bar.success.confirm-restore-password');
      this.className = 'success-snackbar';
    },
    signUp: () => {
      this.getSnackBarMessage('snack-bar.success.sign-up');
      this.className = 'success-snackbar';
    },
    cafeNotificationsExists: () => {
      this.getSnackBarMessage('update-cafe.notifications.exists');
      this.className = 'error-snackbar';
    },
    cafeNotificationsCloseTime: () => {
      this.getSnackBarMessage('update-cafe.notifications.closeTime');
      this.className = 'error-snackbar';
    },
    cafeNotificationsBreakTime: () => {
      this.getSnackBarMessage('update-cafe.notifications.breakTime');
      this.className = 'error-snackbar';
    },
    cafeNotificationsPhotoUpload: () => {
      this.getSnackBarMessage('update-cafe.notifications.photoUpload');
      this.className = 'error-snackbar';
    },
    errorMessage: (error) => {
      this.message = error;
      this.className = 'error-snackbar';
    }
  };

  constructor(public snackBar: MatSnackBar,
              private translate: TranslateService) { }

  public openSnackBar(type: string) {
    this.snackType[type] ?  this.snackType[type]() : type.includes('400') ? this.snackType.error() : this.snackType.errorMessage(type);

    this.snackBar.open(this.message, 'X', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [this.className]
    });
  }

  public getSnackBarMessage(key: string) {
    this.translate.get(key).subscribe(translation => {
        this.message = translation;
    });
  }
}
