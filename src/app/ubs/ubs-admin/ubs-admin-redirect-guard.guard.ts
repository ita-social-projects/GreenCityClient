import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { JwtService } from '@global-service/jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UbsAdminRedirectGuard implements CanActivate {
  isAdmin: boolean;
  private adminRoleValue = 'ROLE_UBS_EMPLOYEE';

  constructor(private router: Router, private jwtService: JwtService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.checkIsAdmin();
    if (this.isAdmin) {
      this.router.navigate(['ubs-admin', 'orders']);
      return false;
    }
    return true;
  }

  checkIsAdmin(): void {
    this.jwtService.userRole$.subscribe((userRole) => {
      this.isAdmin = userRole === this.adminRoleValue;
    });
  }
}
