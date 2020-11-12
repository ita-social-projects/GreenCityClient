import { Component, Input, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mat-snack-bar',
  templateUrl: './mat-snack-bar.component.html',
  styleUrls: ['./mat-snack-bar.component.scss'],
  providers: [TranslateService]
})
export class MatSnackBarComponent implements OnChanges {
  public message: string;
  public message1: string;
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
    }
  };

  constructor(public snackBar: MatSnackBar,
              private translate: TranslateService) { }

  public openSnackBar(type: string) {
    this.snackType[type]();
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


  ngOnChanges() {
  }
}
