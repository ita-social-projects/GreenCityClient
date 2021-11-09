import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { filter } from 'rxjs/operators';
import { AuthModalComponent } from '../../component/auth/components/auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthPageGuardService implements CanActivate {
  private isLoggedIn = false;
  private ubsRegValue: boolean;

  constructor(private localStorageService: LocalStorageService, private router: Router, public dialog: MatDialog) {
    this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.isLoggedIn = userId !== null && !isNaN(userId)));
    this.localStorageService.ubsRegBehaviourSubject.subscribe((value) => (this.ubsRegValue = value));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isLoggedIn) {
      this.openSingInWindow('sign-in');
      return of(false);
    }
    return of<boolean>(true);
  }

  private openSingInWindow(popupName: string): void {
    this.dialog
      .open(AuthModalComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        panelClass: 'custom-dialog-container',
        data: {
          popUpName: popupName
        }
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((userId) => {
        if (!this.ubsRegValue) {
          this.router.navigateByUrl(`${userId}/profile`);
        } else {
          this.router.navigateByUrl('/ubs/order');
        }
      });
  }
}
