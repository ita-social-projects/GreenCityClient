import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WindowsigninComponent } from 'src/app/component/user/modal-auth/windowsignin/windowsignin.component';

@Injectable({
  providedIn: 'root'
})
export class HomePageGuardService implements CanActivate {

  private isLoggedIn = false;
  private userId: number;

  constructor(
  private localStorageService: LocalStorageService,
  private router: Router,
  private matDialogRef: MatDialogRef<WindowsigninComponent>,
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.localStorageService
      .userIdBehaviourSubject
      .pipe(
        filter(userId => userId !== null && !isNaN(userId))
      )
      .subscribe(userId => {
        this.isLoggedIn = true;
        this.userId = userId;
     });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isLoggedIn) {  
      this.matDialogRef.close();
      return this.router.navigateByUrl(`${this.userId}/habits`).then(r => r);  
    }
    return this.router.navigateByUrl('/welcome').then(r => r);
  }
}
