import { AuthModalComponent } from 'src/app/main/component/auth/components/auth-modal/auth-modal.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmRestorePasswordGuard {
  currenDate: number = Date.now();
  millisecondsOfDay = 86400000;
  isUbs: boolean;
  constructor(
    private readonly router: Router,
    public readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBarService
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = next.queryParams.token;
    this.isUbs = next.pathFromRoot[1].routeConfig.path.includes('ubs');
    if (!token) {
      this.router.navigateByUrl(this.isUbs ? '/ubs' : '/');
      return false;
    }
    const tokenString = atob(token);
    const dateFromToken = tokenString.split('.')[0];
    if (this.currenDate - +dateFromToken > this.millisecondsOfDay) {
      this.openSingInWindow();
      this.snackBar.openSnackBar('sendNewLetter');
      this.router.navigateByUrl(this.isUbs ? '/ubs' : '/');
      return false;
    } else {
      return true;
    }
  }

  private openSingInWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
      data: {
        popUpName: 'restore-password'
      }
    });
  }
}
