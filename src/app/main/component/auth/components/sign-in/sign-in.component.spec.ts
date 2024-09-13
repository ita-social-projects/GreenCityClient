import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { UserOwnSignIn } from '@global-models/user-own-sign-in';
import { UserSuccessSignIn } from '@global-models/user-success-sign-in';
import { JwtService } from '@global-service/jwt/jwt.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { ErrorComponent } from '../error/error.component';
import { GoogleBtnComponent } from '../google-btn/google-btn.component';
import { SignInComponent } from './sign-in.component';

declare global {
  interface Window {
    google: any;
  }
}

xdescribe('SignIn component', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let router: Router;
  const initialState = {
    employees: null,
    error: null,
    employeesPermissions: []
  };

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ employees: { employeesPermissions: mockData } }));

  const matDialogMock: MatDialogRef<SignInComponent> = jasmine.createSpyObj('MatDialogRef', ['close']);
  matDialogMock.close = () => 'Close the window please';

  const userSuccessSignIn = new UserSuccessSignIn();
  userSuccessSignIn.userId = '1';
  userSuccessSignIn.name = '1';
  userSuccessSignIn.accessToken = '1';
  userSuccessSignIn.refreshToken = '1';

  const googleServiceMock: GoogleSignInService = jasmine.createSpyObj('GoogleSignInService', ['signIn']);
  googleServiceMock.signIn = () => of(userSuccessSignIn);

  const googleAccountMock = {
    id: {
      initialize: jasmine.createSpy('initialize'),
      prompt: jasmine.createSpy('prompt')
    }
  };

  window.google = { accounts: googleAccountMock };

  const jwtServiceMock: JwtService = jasmine.createSpyObj('JwtService', ['getUserRole', 'getEmailFromAccessToken']);
  jwtServiceMock.getUserRole = () => 'ROLE_USER';
  jwtServiceMock.getEmailFromAccessToken = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  const actionsMock = jasmine.createSpyObj('Actions', ['pipe']);
  actionsMock.pipe.and.returnValue(of({}));

  beforeEach(waitForAsync(async () => {
    window.google = { accounts: googleAccountMock };

    TestBed.configureTestingModule({
      declarations: [SignInComponent, ErrorComponent, GoogleBtnComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Store, useValue: storeMock },
        { provide: GoogleSignInService, useValue: googleServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: MatDialogRef, useValue: matDialogMock },
        { provide: Actions, useValue: actionsMock },
        { provide: ProfileService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = fixture.debugElement.injector.get(Router);
    spyOn<any>(component, 'initGooglePopup');
    spyOn(router.url, 'includes').and.returnValue(false);
    spyOn(router, 'navigate');
  });

  describe('Basic tests', () => {
    it('Should create component', () => {
      expect(component).toBeDefined();
    });

    it('Should open forgot password modal window', () => {
      spyOn(component, 'onOpenModalWindow');

      const nativeElement = fixture.nativeElement;
      const button = nativeElement.querySelector('.forgot-password');
      button.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      expect(component.onOpenModalWindow).toHaveBeenCalledWith('restore-password');
    });
  });

  describe('Login functionality testing', () => {
    it('Check what data comes on subscription', waitForAsync(() => {
      const userOwnSignIn = new UserOwnSignIn();
      userOwnSignIn.email = '1';
      userOwnSignIn.password = '1';
    }));

    it('Test sign in method with invalid signInForm', waitForAsync(
      inject([UserOwnSignInService], (service: UserOwnSignInService) => {
        spyOn(service, 'signIn').and.returnValue(of(userSuccessSignIn));
        const passwordControl = component.signInForm.get('password');
        passwordControl.markAsTouched();
        passwordControl.setValue('');
        const emailControl = component.signInForm.get('email');
        emailControl.markAsTouched();
        emailControl.setValue('test@test.gmail.com');

        component.signIn();
        fixture.detectChanges();
        expect(service.signIn).not.toHaveBeenCalled();
      })
    ));
  });

  describe('Password hiding testing:', () => {
    let debug: DebugElement;
    let hiddenEyeDeImg;
    let hiddenEyeDeInput;
    let hiddenEyeImg: HTMLImageElement;
    let hiddenEyeInput: HTMLInputElement;

    beforeEach(() => {
      debug = fixture.debugElement;
      hiddenEyeDeImg = debug.query(By.css('.image-show-hide-password'));
      hiddenEyeDeInput = debug.query(By.css('#password'));
      hiddenEyeImg = hiddenEyeDeImg.nativeElement;
      hiddenEyeInput = hiddenEyeDeInput.nativeElement;
    });

    it('should display hiddenEye img', () => {
      fixture.detectChanges();
      expect(hiddenEyeImg.src).toContain(component.hideShowPasswordImage.hidePassword);
    });

    it('should call togglePassword method', () => {
      spyOn(component, 'togglePassword');
      hiddenEyeImg.click();
      expect(component.togglePassword).toHaveBeenCalled();
    });

    it('should change img after togglePassword call method', () => {
      hiddenEyeImg.click();
      expect(hiddenEyeImg.src).toContain(component.hideShowPasswordImage.showPassword);
    });

    it('should change type of input after togglePassword call method', () => {
      hiddenEyeImg.click();
      expect(hiddenEyeInput.type).toEqual('text');

      hiddenEyeImg.click();
      expect(hiddenEyeInput.type).toEqual('password');
    });
  });
});
