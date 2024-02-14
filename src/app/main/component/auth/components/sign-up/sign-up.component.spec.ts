import { Language } from './../../../../i18n/Language';
import { UserOwnSignUp } from './../../../../model/user-own-sign-up';
import { UserSuccessSignIn } from './../../../../model/user-success-sign-in';
import { ComponentFixture, TestBed, fakeAsync, flush, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
// import { AgmCoreModule } from '@agm/core';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { UserOwnSignUpService } from '@auth-service/user-own-sign-up.service';
import { SubmitEmailComponent } from '@global-auth/submit-email/submit-email.component';
import { SignUpComponent } from './sign-up.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

class UserOwnSignUpServiceMock {
  mockFormData = {
    email: 'test@gmail.com',
    firstName: 'JohnSmith',
    password: '123456qW@'
  };

  signUp() {
    return of(this.mockFormData);
  }
}

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let localStorageServiceMock: LocalStorageService;
  let router: Router;
  // localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;
  localStorageServiceMock.setFirstName = () => true;
  localStorageServiceMock.setFirstSignIn = () => true;
  localStorageServiceMock.getUserId = () => 1;
  localStorageServiceMock.setAccessToken = () => true;
  localStorageServiceMock.setRefreshToken = () => true;
  localStorageServiceMock.setUserId = () => true;

  class MatDialogRefMock {
    close() {}
  }

  const mockFormData = {
    email: 'test@gmail.com',
    firstName: 'JohnSmith',
    password: '123456qW@'
  };

  const MatSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent, SubmitEmailComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        // AgmCoreModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: UserOwnSignUpService, useClass: UserOwnSignUpServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = fixture.debugElement.injector.get(Router);
    spyOn(router.url, 'includes').and.returnValue(false);
    spyOn(router, 'navigate');
  });

  describe('Basic tests', () => {
    beforeEach(() => {
      spyOn((component as any).pageName, 'emit');
    });

    it('should create SignUpComponent', () => {
      expect(component).toBeTruthy();
    });

    it('should call closeSignUpWindow ', () => {
      const spy = spyOn((component as any).matDialogRef, 'close').and.callThrough();
      (component as any).closeSignUpWindow();
      expect(spy).toHaveBeenCalled();
    });

    it('should emit "sign-in" after calling openSignInWindow', () => {
      component.openSignInWindow();
      expect((component as any).pageName.emit).toHaveBeenCalledWith('sign-in');
    });
  });

  describe('Reset error messages', () => {
    it('Should reset error messages', () => {
      component.firstNameErrorMessageBackEnd = 'I am error message';
      component.emailErrorMessageBackEnd = 'I am error message';
      component.passwordErrorMessageBackEnd = 'I am error message';
      component.passwordConfirmErrorMessageBackEnd = 'I am error message';
      (component as any).setNullAllMessage();
      expect(component.firstNameErrorMessageBackEnd).toBeNull();
      expect(component.passwordErrorMessageBackEnd).toBeNull();
      expect(component.emailErrorMessageBackEnd).toBeNull();
      expect(component.passwordConfirmErrorMessageBackEnd).toBeNull();
    });
  });

  describe('Password hiding testing:', () => {
    let debug: DebugElement;
    let hiddenEyeImg: HTMLImageElement;
    let hiddenEyeInput: HTMLInputElement;
    let hiddenEyeDeImg;
    let hiddenEyeDeInput;

    beforeEach(() => {
      debug = fixture.debugElement;
      hiddenEyeDeImg = debug.query(By.css('.show-password-img'));
      hiddenEyeDeInput = debug.query(By.css('.password-input'));
      hiddenEyeImg = hiddenEyeDeImg.nativeElement;
      hiddenEyeInput = hiddenEyeDeInput.nativeElement;
    });

    it('should display hiddenEye img', () => {
      fixture.detectChanges();
      expect(hiddenEyeImg.src).toContain(component.signUpImages.hiddenEye);
    });

    it('should call setPasswordVisibility method', () => {
      spyOn(component, 'setPasswordVisibility');
      hiddenEyeImg.click();
      expect(component.setPasswordVisibility).toHaveBeenCalled();
    });

    it('should change img after calling setPasswordVisibility method', () => {
      hiddenEyeImg.click();
      expect(hiddenEyeImg.src).toContain(component.signUpImages.openEye);

      hiddenEyeImg.click();
      expect(hiddenEyeImg.src).toContain(component.signUpImages.hiddenEye);
    });

    it('should change type of input after calling setPasswordVisibility method', () => {
      hiddenEyeImg.click();
      expect(hiddenEyeInput.type).toEqual('text');

      hiddenEyeImg.click();
      expect(hiddenEyeInput.type).toEqual('password');
    });
  });

  describe('Testing controls for the signUpForm:', () => {
    const controlsName = ['email', 'firstName', 'password', 'repeatPassword'];
    const invalidName = ['.Jhon', 'Nick&', 'Mi$ke', '@Andrian'];
    const validName = ['JhonSmith', 'Nick12', 'Angela', 'Andrian'];
    const invalidPassword = ['12345aS', '12345aaS', '123456S@', '123456a@'];
    const validPassword = ['12345aS@', 'Aqwert1%', 'Pi$98765', '!1234567kT'];

    function testWrapper(itemValue) {
      it(`should create form with formControl: ${itemValue};`, () => {
        expect(component.signUpForm.contains(itemValue)).toBeTruthy();
      });
    }

    controlsName.forEach((el) => testWrapper(el));

    it('form should be invalid when empty', () => {
      expect(component.signUpForm.valid).toBeFalsy();
    });

    function controlsValidator(itemValue, controlName, status) {
      it(`The formControl: ${controlName} should be marked as ${status} if the value is ${itemValue}.`, () => {
        const control = component.signUpForm.get(controlName);
        control.setValue(itemValue);
        status === 'valid' ? expect(control.valid).toBeTruthy() : expect(control.valid).toBeFalsy();
      });
    }

    invalidName.forEach((el) => controlsValidator(el, 'firstName', 'invalid'));

    validName.forEach((el) => controlsValidator(el, 'firstName', 'valid'));

    invalidPassword.forEach((el) => controlsValidator(el, 'password', 'invalid'));

    validPassword.forEach((el) => controlsValidator(el, 'password', 'valid'));

    it('should trim value', () => {
      const emailControl = component.signUpForm.get('email');
      emailControl.setValue('    1qQ@');
      component.trimValue(emailControl);
      expect(emailControl.value).toBe('1qQ@');
    });

    it('form should be invalid passwords not matching', () => {
      const passwordControl = component.signUpForm.get('password');
      passwordControl.setValue('123456qQ@');
      const repeatPasswordControl = component.signUpForm.get('repeatPassword');
      repeatPasswordControl.setValue('23456qQ@1');
      expect(component.signUpForm.valid).toBeFalsy();
    });
  });

  describe('Check sign up methods', () => {
    let mockUserSuccessSignIn: UserSuccessSignIn;

    beforeEach(() => {
      mockUserSuccessSignIn = {
        userId: '23',
        name: 'JohnSmith',
        accessToken: 'test',
        refreshToken: 'test'
      };
    });

    it('onSubmit should call userOwnSignUpService', () => {
      (component as any).onSubmitSuccess = () => true;
      const spy = spyOn((component as any).userOwnSignUpService, 'signUp').and.returnValue(of(mockFormData));
      component.onSubmit(mockFormData as UserOwnSignUp);
      expect(spy).toHaveBeenCalledWith(mockFormData, 'ua');
    });

    it('onSubmit should call onSubmitError', () => {
      const errors = new HttpErrorResponse({ error: [{ name: 'name', message: 'Ups' }] });
      const spy = spyOn((component as any).userOwnSignUpService, 'signUp').and.returnValue(throwError(errors));
      component.onSubmit(mockFormData as UserOwnSignUp);
      expect(spy).toHaveBeenCalled();
    });

    describe('Check sign up with signInWithGoogle', () => {
      it('signUpWithGoogleSuccess should navigate to profilePage', fakeAsync(() => {
        (component as any).signUpWithGoogleSuccess(mockUserSuccessSignIn);
        fixture.ngZone.run(() => {
          expect(router.navigate).toHaveBeenCalledWith(['profile', mockUserSuccessSignIn.userId]);
        });
        fixture.destroy();
        flush();
      }));
    });
  });

  describe('Check ErrorMessageBackEnd', () => {
    it('should return firstNameErrorMessageBackEnd when login failed', () => {
      const errors = new HttpErrorResponse({
        error: [
          { name: 'name', message: 'Ups' },
          { name: 'email', message: 'Ups' },
          { name: 'password', message: 'Ups' },
          { name: 'passwordConfirm', message: 'Ups' }
        ]
      });
      (component as any).onSubmitError(errors);
      fixture.detectChanges();
      expect(component.firstNameErrorMessageBackEnd).toBe('Ups');
      expect(component.emailErrorMessageBackEnd).toBe('Ups');
      expect(component.passwordErrorMessageBackEnd).toBe('Ups');
      expect(component.passwordConfirmErrorMessageBackEnd).toBe('Ups');
    });

    it('should return emailErrorMessageBackEnd when login failed', () => {
      const errors = new HttpErrorResponse({ error: [{ name: 'email', message: 'Ups' }] });
      (component as any).signUpWithGoogleError(errors);
      fixture.detectChanges();
      expect(component.emailErrorMessageBackEnd).toBe('Ups');
    });

    it('should return passwordConfirmErrorMessageBackEnd when login failed', () => {
      const errors = new HttpErrorResponse({ error: [{ name: 'password', message: 'Ups' }] });
      (component as any).signUpWithGoogleError(errors);
      fixture.detectChanges();
      expect(component.passwordConfirmErrorMessageBackEnd).toBe('Ups');
    });

    it('should reset emailErrorMessageBackEnd', () => {
      component.setEmailBackendErr();
      expect(component.emailErrorMessageBackEnd).toBeNull();
    });

    it('signUpWithGoogleError should set errors', () => {
      const result = (component as any).signUpWithGoogleError('User cancelled login or did not fully authorize');
      expect(result).toBe(null);
    });

    it('signUpWithGoogleError should set errors', () => {
      const errors = {
        error: {
          message: 'Ups'
        }
      };
      (component as any).signUpWithGoogleError(errors);
      expect(component.backEndError).toBe('Ups');
    });
  });
});
