import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';
import { SignInComponent } from '../../component/auth/components/sign-in/sign-in.component';

@Injectable({
  providedIn: 'root'
})
export class AuthPageGuardService implements CanActivate {

  private isLoggedIn = false;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.localStorageService
      .userIdBehaviourSubject
      .subscribe(userId => this.isLoggedIn = userId !== null && !isNaN(userId));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isLoggedIn) {
    this.openSingInWindow();
    return of (false);
    }
    return of<boolean>(true);
  }

  private openSingInWindow(): void {
    this.dialog.open(SignInComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    }).afterClosed()
      .pipe(
        filter(Boolean)
      )
      .subscribe((userId) => this.router.navigateByUrl(`${userId}/profile`));
  }
}
