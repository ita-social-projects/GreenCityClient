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
      this.className = 'error-snackbar';
      this.getSnackBarMessage('snack-bar.error.default');
    },
    attention: () => {
      this.className = 'attention-snackbar';
      this.getSnackBarMessage('snack-bar.attention.default');
    },
    success: () => {
      this.className = 'success-snackbar';
      this.getSnackBarMessage('snack-bar.success.default');
    },
    exitConfirmRestorePassword: () => {
      this.className = 'attention-snackbar';
      this.getSnackBarMessage('snack-bar.attention.exit-confirm-restore-password');
    },
    successRestorePassword: () => {
      this.className = 'success-snackbar';
      this.getSnackBarMessage('snack-bar.success.restore-password');
    },
    successConfirmPassword: () => {
      this.className = 'success-snackbar';
      this.getSnackBarMessage('snack-bar.success.confirm-restore-password');
    },
    signUp: () => {
      this.className = 'success-snackbar';
      this.getSnackBarMessage('snack-bar.success.sign-up');
    },
    successConfirmEmail: () => {
      this.className = 'success-snackbar';
      this.getSnackBarMessage('snack-bar.success.confirm-email');
    },
    errorMessage: (error) => {
      this.className = 'error-snackbar';
      this.message = error;
    }
  };

  constructor(public snackBar: MatSnackBar,
              private translate: TranslateService) { }

  public openSnackBar(type: string): void {
    this.snackType[type] ? this.snackType[type]() : type.includes('400') ? this.snackType.error() : this.snackType.errorMessage(type);
  }

  public getSnackBarMessage(key: string): void {
    this.translate.get(key).subscribe(translation => {
      this.message = translation;
      this.snackBar.open(this.message, 'X', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: [this.className]
      });
    });
  }
}
