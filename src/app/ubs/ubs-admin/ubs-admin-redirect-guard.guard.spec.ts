import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UbsAdminRedirectGuard } from './ubs-admin-redirect-guard.guard';
import { JwtService } from '@global-service/jwt/jwt.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

describe('UbsAdminRedirectGuard', () => {
  let guard: UbsAdminRedirectGuard;
  let router: Router;
  let jwtService: JwtService;

  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [UbsAdminRedirectGuard, JwtService, { provide: Router, useValue: routerSpy }]
    });
    guard = TestBed.inject(UbsAdminRedirectGuard);
    router = TestBed.inject(Router);
    jwtService = TestBed.inject(JwtService);
  });

  it('should allow access for a non-admin user', () => {
    spyOn(jwtService, 'getUserRole').and.returnValue('ROLE_USER');
    const result = guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: '' });

    expect(result).toBeTruthy();
  });

  it('should redirect to /ubs-admin/orders for an admin user', () => {
    spyOn(jwtService, 'getUserRole').and.returnValue('ROLE_UBS_EMPLOYEE');

    const navigateSpy = spyOn(router, 'navigate');
    const result = guard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: '' });

    expect(result).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['ubs-admin', 'orders']);
  });
});
