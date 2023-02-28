import { UserSuccessSignIn } from './../../../../model/user-success-sign-in';
import { UserOwnSignIn } from './../../../../model/user-own-sign-in';
import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileService } from '../../../user/components/profile/profile-service/profile.service';

import { UserOwnSignInService } from '@auth-service/user-own-sign-in.service';
import { GoogleBtnComponent } from '../google-btn/google-btn.component';
import { ErrorComponent } from '../error/error.component';
import { SignInComponent } from './sign-in.component';
import { JwtService } from '@global-service/jwt/jwt.service';

describe('SignIn component', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let localStorageServiceMock: LocalStorageService;
  let matDialogMock: MatDialogRef<SignInComponent>;
  let signInServiceMock: UserOwnSignInService;
  let router: Router;
  let googleServiceMock: GoogleSignInService;
  let userSuccessSignIn;

  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.setFirstName = () => true;
  localStorageServiceMock.setFirstSignIn = () => true;
  localStorageServiceMock.getUserId = () => 1;
  localStorageServiceMock.getAccessToken = () => '1';

  matDialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);
  matDialogMock.close = () => 'Close the window please';

  userSuccessSignIn = new UserSuccessSignIn();
  userSuccessSignIn.userId = 1;
  userSuccessSignIn.name = '1';
  userSuccessSignIn.accessToken = '1';
  userSuccessSignIn.refreshToken = '1';

  signInServiceMock = jasmine.createSpyObj('UserOwnSignInService', ['signIn']);
  signInServiceMock.signIn = () => {
    return of(userSuccessSignIn);
  };
  signInServiceMock.saveUserToLocalStorage = () => true;

  googleServiceMock = jasmine.createSpyObj('GoogleSignInService', ['signIn']);
  googleServiceMock.signIn = () => of(userSuccessSignIn);

  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  beforeEach(async(() => {
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
        { provide: GoogleSignInService, useValue: googleServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: MatDialogRef, useValue: matDialogMock },
        { provide: UserOwnSignInService, useValue: signInServiceMock },
        { provide: ProfileService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = fixture.debugElement.injector.get(Router);
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

    it('Should get userId', () => {
      expect(localStorageServiceMock.userIdBehaviourSubject.value).toBe(1111);
    });

    it('should emit "sign-up" after calling openSignInWindowp', () => {
      // @ts-ignore
      spyOn(component.pageName, 'emit');
      component.onOpenModalWindow('sign-up');
      // @ts-ignore
      expect(component.pageName.emit).toHaveBeenCalledWith('sign-up');
    });
  });

  describe('Check valid state of both input fields functionality testing', () => {
    it('Should change value of generalError to error message if both fiels are touched and empty', () => {
      const passwordControl = component.signInForm.get('password');
      passwordControl.markAsTouched();
      const emailControl = component.signInForm.get('email');
      emailControl.markAsTouched();
      component.allFieldsEmptyCheck();
      expect(component.generalError).toEqual('user.auth.sign-in.fill-all-red-fields');
    });

    it('Should change value of generalError to null if at least one has value', () => {
      const emailControl = component.signInForm.get('email');
      emailControl.markAsTouched();
      emailControl.setValue('test');

      component.allFieldsEmptyCheck();
      expect(component.generalError).toEqual(null);
    });
  });

  describe('Login functionality testing', () => {
    it('Check what data comes on subscription', async(() => {
      const userOwnSignIn = new UserOwnSignIn();
      userOwnSignIn.email = '1';
      userOwnSignIn.password = '1';
      signInServiceMock.signIn(userOwnSignIn).subscribe((data) => {
        expect(data).toBeTruthy();
      });
    }));

    it('Should call sinIn method', inject([GoogleSignInService], (service: GoogleSignInService) => {
      const resp = {};
      const spy1 = spyOn(service, 'signIn').and.returnValue(of(userSuccessSignIn));
      const spy2 = spyOn(component, 'onSignInWithGoogleSuccess');
      component.handleGgOneTap(resp as any);
      fixture.detectChanges();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(userSuccessSignIn);
    }));

    it('Test sign in method with invalid signInForm', async(
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

    it('Test sign in method with valid signInForm', async(
      inject([UserOwnSignInService], (service: UserOwnSignInService) => {
        spyOn(service, 'signIn').and.returnValue(of(userSuccessSignIn));
        const passwordControl = component.signInForm.get('password');
        passwordControl.markAsTouched();
        passwordControl.setValue('888888888');
        const emailControl = component.signInForm.get('email');
        emailControl.markAsTouched();
        emailControl.setValue('test@test.gmail.com');

        component.signIn();
        fixture.detectChanges();
        expect(service.signIn).toHaveBeenCalled();
      })
    ));

    it('Test sign in method with errors', async(
      inject([UserOwnSignInService], (service: UserOwnSignInService) => {
        const errors = new HttpErrorResponse({ error: [{ name: 'name', message: 'Ups' }] });
        spyOn(service, 'signIn').and.returnValue(throwError(errors));
        const passwordControl = component.signInForm.get('password');
        passwordControl.markAsTouched();
        passwordControl.setValue('888888888');
        const emailControl = component.signInForm.get('email');
        emailControl.markAsTouched();
        emailControl.setValue('test@test.gmail.com');
        component.signIn();
        fixture.detectChanges();
        expect(service.signIn).toHaveBeenCalled();
      })
    ));

    it('Sohuld navige to profile after sign in', async(() => {
      fixture.ngZone.run(() => {
        // @ts-ignore
        component.onSignInSuccess(userSuccessSignIn);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(router.navigate).toHaveBeenCalledWith(['profile', userSuccessSignIn.userId]);
        });
      });
    }));
  });

  describe('Error functionality testing', () => {
    let errors;

    it('Should return an generalError when login failed', () => {
      errors = new HttpErrorResponse({ error: { message: 'Ups' } });

      // @ts-ignore
      component.onSignInFailure(errors);
      fixture.detectChanges();
      expect(component.generalError).toBe('user.auth.sign-in.bad-email-or-password');
    });

    it('Should return an generalError when login failed with deleted user', () => {
      errors = new HttpErrorResponse({ error: { error: 'Unauthorized' } });

      // @ts-ignore
      component.onSignInFailure(errors);
      fixture.detectChanges();
      expect(component.generalError).toBe('user.auth.sign-in.account-has-been-deleted');
    });

    it('Should reset error messages', () => {
      component.generalError = 'I am error message';
      // @ts-ignore
      component.configDefaultErrorMessage();

      expect(component.generalError).toBeNull();
    });

    it('onSignInFailure should set errors', () => {
      // @ts-ignore
      const result = component.onSignInFailure('User cancelled login or did not fully authorize');
      expect(result).toBe();
    });
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
