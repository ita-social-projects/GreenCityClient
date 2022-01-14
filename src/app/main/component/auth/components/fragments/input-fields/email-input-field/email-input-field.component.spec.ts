import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { EmailInputFieldComponent } from './email-input-field.component';
import { RouterModule } from '@angular/router';
import { AuthService, AuthServiceConfig, LoginOpt, SocialUser } from 'angularx-social-login';
import { JwtService } from '@global-service/jwt/jwt.service';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

describe('EmailInputFieldComponent', () => {
  let component: EmailInputFieldComponent;
  let fixture: ComponentFixture<EmailInputFieldComponent>;
  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  let matSnackBarMock: MatSnackBarComponent;
  matSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = (type: string) => {};

  let authServiceMock: AuthService;
  const promiseSocialUser = new Promise<SocialUser>((resolve) => {
    const val = new SocialUser();
    val.email = '1';
    val.firstName = '1';
    val.authorizationCode = '1';
    val.id = '1';
    val.name = '1';
    val.photoUrl = '1';
    val.authToken = '1';
    resolve(val);
  });

  authServiceMock = jasmine.createSpyObj('AuthService', ['signIn']);
  authServiceMock.signIn = (providerId: string, opt?: LoginOpt) => promiseSocialUser;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailInputFieldComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterModule.forRoot([{ path: '', component: EmailInputFieldComponent }])],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBarComponent, useValue: matSnackBarMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
     expect(component).toBeDefined();
  });*/
});
