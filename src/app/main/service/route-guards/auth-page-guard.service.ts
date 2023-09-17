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

  constructor(private localStorageService: LocalStorageService, private router: Router, public dialog: MatDialog) {
    this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.isLoggedIn = userId !== null && !isNaN(userId)));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isLoggedIn) {
      this.openSingInWindow('sign-in', state);
      if (state.url.includes('ubs')) {
        return this.router.parseUrl('/ubs');
      } else {
        return this.router.parseUrl('/greenCity');
      }
    }
    return of<boolean>(true);
  }

  private openSingInWindow(popupName: string, state): void {
    this.dialog
      .open(AuthModalComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        panelClass: 'custom-dialog-container',
        data: {
          popUpName: popupName,
          isUBS: state.url.includes('ubs')
        }
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        if (this.isLoggedIn) {
          this.router.navigateByUrl(state.url);
        }
      });
  }
}
