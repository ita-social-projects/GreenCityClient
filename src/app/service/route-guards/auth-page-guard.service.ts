import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WindowsigninComponent } from 'src/app/component/user/modal-auth/windowsignin/windowsignin.component';

@Injectable({
  providedIn: 'root'
})
export class AuthPageGuardService implements CanActivate {

  private isLoggedIn = false;
  dialog: any;

  constructor(private localStorageService: LocalStorageService, private router: Router) {
    this.localStorageService
      .userIdBehaviourSubject
      .subscribe(userId => this.isLoggedIn = userId !== null && !isNaN(userId));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isLoggedIn) {
      return this.router.navigateByUrl('/welcome').then(r => r);
      //return this.router.navigateByUrl('/auth').then(r => r);
    }
    return of<boolean>(true);
  }
}
