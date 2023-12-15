import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VerifyEmailService } from '@auth-service/verify-email/verify-email.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private verifyEmailService: VerifyEmailService,
    private snackBar: MatSnackBarComponent,
    public dialog: MatDialog
  ) {}

  public onCheckToken(): void {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          const { token, user_id } = params;
          return token && user_id ? this.verifyEmailService.onCheckToken(token, user_id) : EMPTY;
        })
      )
      .subscribe((res) => {
        if (res) {
          this.snackBar.openSnackBar('successConfirmEmail');
          this.openAuthModalWindow();
        }
      });
  }
  public openAuthModalWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container', 'transparent'],
      data: {
        popUpName: 'sign-in'
      }
    });
  }
}
