import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomePageGuardService implements CanActivate {

  private isLoggedIn = false;
  private userId: number;

  constructor(private localStorageService: LocalStorageService, private router: Router) {
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
      return this.router.navigateByUrl(`${this.userId}/habits`).then(r => r);
    }
    return this.router.navigateByUrl('/welcome').then(r => r);
  }
}
