import { async, TestBed } from '@angular/core/testing';
import { PopUpViewService } from './pop-up-view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { AuthService } from 'angularx-social-login';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';

describe('PopUpViewService', async () => {
  const service: PopUpViewService = TestBed.inject(PopUpViewService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpViewService],
      imports: [HttpClient, UserOwnSignInService, AuthService, JwtService, GoogleSignInService, HttpClientTestingModule]
    }).compileComponents();
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
