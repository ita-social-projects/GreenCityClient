import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PasswordInputFieldComponent } from './password-input-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { JwtService } from '@global-service/jwt/jwt.service';
/*import { BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AuthService, LoginOpt, SocialUser } from 'angularx-social-login';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

describe('PasswordInputFieldComponent', () => {
  let component: PasswordInputFieldComponent;
  let fixture: ComponentFixture<PasswordInputFieldComponent>;
  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');
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

  let matSnackBarMock: MatSnackBarComponent;
  matSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = (type: string) => {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordInputFieldComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterModule.forRoot([{ path: '', component: PasswordInputFieldComponent }])],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBarComponent, useValue: matSnackBarMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeDefined();
  });
});*/
