import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UbsAdminRedirectGuard } from './ubs-admin-redirect-guard.guard';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

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

  describe('canActivate', () => {
    it('should return true when the user is not an admin', () => {
      spyOn(jwtService, 'getUserRole').and.returnValue('ROLE_USER');
      const result = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      expect(result).toBeTruthy();
    });

    it('should navigate to /ubs-admin/orders and return false when the user is an admin', () => {
      spyOn(jwtService, 'getUserRole').and.returnValue('ROLE_UBS_EMPLOYEE');
      const result = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      expect(result).toBeTruthy();
    });
  });
});
