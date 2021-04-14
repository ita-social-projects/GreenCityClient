import { MatSnackBarComponent } from './../../component/errors/mat-snack-bar/mat-snack-bar.component';
import { MatDialog } from '@angular/material';
import { AuthModalComponent } from './../../component/auth/components/auth-modal/auth-modal.component';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmRestorePasswordGuard implements CanActivate {

  currenDate: number = Date.now();
  millisecondsOfDay: number = 86400000; 

  constructor( private router: Router, public dialog: MatDialog, private snackBar: MatSnackBarComponent) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
      const token = next.queryParams.token;
      const tokenString = atob(token);
      const dateFromToken = tokenString.split(".")[0];
        if (this.currenDate - +dateFromToken > this.millisecondsOfDay) {
          this.openSingInWindow();
          this.snackBar.openSnackBar('sendNewLetter');
          return this.router.navigateByUrl('/');
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
    }
  )}
}
