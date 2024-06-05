import { Injectable } from '@angular/core';
import { Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbsUserGuardGuard {
  isLoggedIn: boolean;
  isAdmin: boolean;
  private adminRoleValue = 'ROLE_UBS_EMPLOYEE';

  constructor(
    private jwtService: JwtService,
    private userOwnAuthService: UserOwnAuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.checkLoggedIn();
    return this.isLoggedIn && !this.isAdmin;
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    this.checkLoggedIn();
    return this.isLoggedIn && !this.isAdmin;
  }
  checkLoggedIn(): void {
    this.userOwnAuthService.isLoginUserSubject.subscribe((status) => (this.isLoggedIn = status));
    this.jwtService.userRole$.subscribe((userRole) => {
      this.isAdmin = userRole === this.adminRoleValue;
    });
  }
}
