import { TestBed } from '@angular/core/testing';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { BehaviorSubject } from 'rxjs';

import { UbsUserGuardGuard } from './ubs-user-guard.guard';

describe('UbsUserGuardGuard', () => {
  let guard: UbsUserGuardGuard;

  const jwtServiceMock: JwtService = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  const userOwnAuthServiceMock: UserOwnAuthService = jasmine.createSpyObj('UserOwnAuthService', [
    'getDataFromLocalStorage',
    'isLoginUserSubject'
  ]);
  userOwnAuthServiceMock.getDataFromLocalStorage = () => true;
  userOwnAuthServiceMock.isLoginUserSubject = new BehaviorSubject(true);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock }
      ]
    });
    guard = TestBed.inject(UbsUserGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
