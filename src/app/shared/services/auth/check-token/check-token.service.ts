import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VerifyEmailService } from 'src/app/shared/services/auth/verify-email/verify-email.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly snackBar: MatSnackBarService,
    public readonly dialog: MatDialog
  ) {}

  onCheckToken(): void {
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
  openAuthModalWindow(): void {
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
