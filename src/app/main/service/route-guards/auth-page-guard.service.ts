import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';
import { AuthModalComponent } from '../../component/auth/components/auth-modal/auth-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AuthPageGuardService implements CanActivate {
  private isLoggedIn = false;

  constructor(private localStorageService: LocalStorageService, private router: Router, public dialog: MatDialog) {
    this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.isLoggedIn = userId !== null && !isNaN(userId)));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isLoggedIn) {
      if (this.localStorageService.getUbsRegistration() === 'true') {
        this.openSingInSingUpWindow('sign-up');
        return of(false);
      } else if (this.localStorageService.getUbsRegistration() === 'false') {
        this.openSingInSingUpWindow('sign-in');
        return of(false);
      }
    }
    return of<boolean>(true);
  }

  private openSingInSingUpWindow(modalName: string): void {
    this.dialog
      .open(AuthModalComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        panelClass: 'custom-dialog-container',
        data: {
          popUpName: modalName
        }
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((userId) => {
        this.router.navigateByUrl(`${userId}/profile`);
      });
  }
}
