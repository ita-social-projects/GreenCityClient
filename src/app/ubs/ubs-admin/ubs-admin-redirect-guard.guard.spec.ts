import { TestBed } from '@angular/core/testing';
import { JwtService } from '@global-service/jwt/jwt.service';
import { BehaviorSubject } from 'rxjs';

import { UbsAdminRedirectGuard } from './ubs-admin-redirect-guard.guard';

describe('UbsAdminRedirectGuard', () => {
  let redirectGuard: UbsAdminRedirectGuard;

  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: JwtService, useValue: jwtServiceMock }]
    });
    redirectGuard = TestBed.inject(UbsAdminRedirectGuard);
  });

  it('should be created', () => {
    expect(redirectGuard).toBeTruthy();
  });
});
