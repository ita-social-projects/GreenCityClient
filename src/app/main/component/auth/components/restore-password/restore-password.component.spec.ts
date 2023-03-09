import { UserSuccessSignIn } from './../../../../model/user-success-sign-in';
import { RestorePasswordComponent } from './restore-password.component';
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { RestorePasswordService } from '@auth-service/restore-password.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleSignInService } from '@auth-service/google-sign-in.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';

describe('RestorePasswordComponent', () => {
  let component: RestorePasswordComponent;
  let fixture: ComponentFixture<RestorePasswordComponent>;
  let localStorageServiceMock: LocalStorageService;
  let googleServiceMock: GoogleSignInService;
  let router: Router;
  let matDialogMock: MatDialogRef<RestorePasswordComponent>;
  let MatSnackBarMock: MatSnackBarComponent;
  let userSuccessSignIn;

  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};

  userSuccessSignIn = new UserSuccessSignIn();
  userSuccessSignIn.userId = '13';
  userSuccessSignIn.name = 'Name';
  userSuccessSignIn.accessToken = '13';
  userSuccessSignIn.refreshToken = '13';

  matDialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);
  matDialogMock.close = () => 'Close the window please';

  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.setFirstName = () => true;
  localStorageServiceMock.setFirstSignIn = () => true;

  googleServiceMock = jasmine.createSpyObj('GoogleSignInService', ['signIn']);
  googleServiceMock.signIn = () => of(userSuccessSignIn);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestorePasswordComponent],
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestorePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = fixture.debugElement.injector.get(Router);
    spyOn(router.url, 'includes').and.returnValue(false);
    spyOn(router, 'navigate');
  });

  describe('Basic tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RestorePasswordComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(component.pageName, 'emit');
    });

    it('should create RestorePasswordComponent', () => {
      expect(component).toBeTruthy();
    });

    it('should call onBackToSignIn', () => {
      // @ts-ignore
      spyOn(component.dialog, 'open');
      // @ts-ignore
      component.onBackToSignIn();
      // @ts-ignore
      expect(component.dialog).toBeDefined();
    });

    it('Should open sign in modal window', () => {
      spyOn(component, 'onBackToSignIn');

      const nativeElement = fixture.nativeElement;
      const button = nativeElement.querySelector('a');
      button.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      expect(component.onBackToSignIn).toHaveBeenCalledWith('sign-in');
    });

    it('should call onCloseRestoreWindow ', () => {
      // @ts-ignore
      const spy = spyOn(component.matDialogRef, 'close').and.callThrough();
      // @ts-ignore
      component.onCloseRestoreWindow();
      expect(spy).toHaveBeenCalled();
    });

    it('Should get userId', () => {
      expect(localStorageServiceMock.userIdBehaviourSubject.value).toBe(1111);
    });
  });

  describe('Restore password functionality testing', () => {
    let restorePasswordService: RestorePasswordService;
    let mockFormData;
    beforeEach(() => {
      restorePasswordService = fixture.debugElement.injector.get(RestorePasswordService);
      mockFormData = {
        email: 'test@mail.com'
      };
    });

    it('signUpWithGoogleSuccess should navigate to homePage', fakeAsync(() => {
      // @ts-ignore
      component.onSignInWithGoogleSuccess(userSuccessSignIn);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('Test sendEmailForRestore method', () => {
      const spy = (restorePasswordService.sendEmailForRestore = jasmine
        .createSpy('sendEmail')
        .and.returnValue(Observable.of(mockFormData)));
      restorePasswordService.sendEmailForRestore(mockFormData);
      expect(spy).toHaveBeenCalled();
    });

    it('sentEmail should call sendEmailForRestore', () => {
      const spy = (restorePasswordService.sendEmailForRestore = jasmine
        .createSpy('sendEmail')
        .and.returnValue(Observable.of(mockFormData)));
      component.sentEmail();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Testing controls for the restorePasswordForm', () => {
    const validEmails = ['test@mail.com', 'mail@mail.ua', 'hello@post.com', 'write2me@mail.com'];
    const invalidEmails = ['notemail', '12345678987654321', 'wooooooow@', '100%mail'];

    function controlsValidator(itemValue, controlName, status) {
      it(`The formControl: ${controlName} should be marked as ${status} if the value is ${itemValue}.`, () => {
        const control = component.restorePasswordForm.get(controlName);
        control.setValue(itemValue);
        status === 'valid' ? expect(control.valid).toBeTruthy() : expect(control.valid).toBeFalsy();
      });
    }

    validEmails.forEach((el) => controlsValidator(el, 'email', 'valid'));
    invalidEmails.forEach((el) => controlsValidator(el, 'email', 'invalid'));

    it('form should be invalid when empty', () => {
      expect(component.restorePasswordForm.valid).toBeFalsy();
    });
  });

  describe('Error functionality testing', () => {
    let errors;

    it('Should return an emailErrorMessageBackEnd when login failed', () => {
      errors = new HttpErrorResponse({ error: { message: 'Ups' } });

      // @ts-ignore
      component.onSentEmailBadMessage(errors);
      fixture.detectChanges();
      expect(component.emailErrorMessageBackEnd).toBe('email-not-exist');
    });

    it('Should return an emailErrorMessageBackEnd when login failed', () => {
      errors = new HttpErrorResponse({ error: [{ name: 'email', message: 'Ups' }] });

      // @ts-ignore
      component.onSignInFailure(errors);
      fixture.detectChanges();
      expect(component.emailErrorMessageBackEnd).toBe('Ups');
    });

    it('Should return an passwordErrorMessageBackEnd when login failed', () => {
      errors = new HttpErrorResponse({ error: [{ name: 'password', message: 'Ups' }] });

      // @ts-ignore
      component.onSignInFailure(errors);
      fixture.detectChanges();
      expect(component.passwordErrorMessageBackEnd).toBe('Ups');
    });

    it('Should return an backEndError when login failed', () => {
      errors = new HttpErrorResponse({ error: { message: 'Ups' } });

      // @ts-ignore
      component.onSignInFailure(errors.error);
      fixture.detectChanges();
      expect(component.backEndError).toBe('Ups');
    });

    it('Should reset error messages', () => {
      component.emailErrorMessageBackEnd = 'I am error message';
      component.passwordErrorMessageBackEnd = 'I am error message';
      component.backEndError = 'I am error message';

      component.configDefaultErrorMessage();

      expect(component.backEndError).toBeNull();
      expect(component.passwordErrorMessageBackEnd).toBeNull();
      expect(component.emailErrorMessageBackEnd).toBeNull();
    });
  });
});
