// import { RestoreDto } from '@global-models/restroreDto';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ChangePasswordService } from '@auth-service/change-password.service';
import { ConfirmRestorePasswordComponent } from './confirm-restore-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

describe('ConfirmRestorePasswordComponent', () => {
  let component: ConfirmRestorePasswordComponent;
  let fixture: ComponentFixture<ConfirmRestorePasswordComponent>;
  let router: Router;

  const MatDialogRefMock = {
    close: () => {}
  };

  const ChangePasswordServiceStub = {
    restorePassword: jasmine.createSpy('restorePassword')
  };

  const MatSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = () => {};

  class Fake {}

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmRestorePasswordComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'welcome',
            component: Fake
          }
        ]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: ChangePasswordService, useValue: ChangePasswordServiceStub },
        { provide: MatDialogRef, useValue: MatDialogRefMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRestorePasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  describe('Basic tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ConfirmRestorePasswordComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create ConfirmRestorePasswordComponent', () => {
      expect(component).toBeTruthy();
    });

    it('should call closeModal()', fakeAsync(() => {
      const spy = spyOn(component, 'closeModal').and.callThrough();
      component.closeModal();
      expect(spy).toHaveBeenCalled();
    }));

    it('should call closeModal()', fakeAsync(() => {
      const spy = spyOn(component, 'closeModal').and.callThrough();
      component.closeModal();
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('Check confirm restore password methods', () => {
    let changePasswordServiceMock: ChangePasswordService;
    let mockFormData;

    beforeEach(() => {
      changePasswordServiceMock = fixture.debugElement.injector.get(ChangePasswordService);
      mockFormData = {
        password: 'Password13.',
        confirmPassword: 'Password13.',
        token: 'token'
      };
    });

    it('sendPasswords should call ChangePasswordService', () => {
      const spy = ChangePasswordServiceStub.restorePassword.and.returnValue(of(mockFormData));
      ChangePasswordServiceStub.restorePassword(mockFormData);
      expect(spy).toHaveBeenCalledWith(mockFormData);
    });

    it('Test sendPasswords method', () => {
      spyOn(global, 'setTimeout');
      const spy = (changePasswordServiceMock.restorePassword = jasmine.createSpy('restore').and.returnValue(of(mockFormData)));
      component.sendPasswords();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Testing controls for the confirmRestorePasswordForm', () => {
    const controlsName = ['password', 'confirmPassword'];
    const validPasswords = ['Pass123.', 'S3cret))', 'S0mething.', 'Passwooooord1.'];
    const invalidPasswords = ['password', 'pass12', '1122334455', '123.123.123.'];

    const testWrapper = (itemValue) => {
      it(`should create form with formControl: ${itemValue};`, () => {
        expect(component.confirmRestorePasswordForm.contains(itemValue)).toBeTruthy();
      });
    };

    controlsName.forEach((el) => testWrapper(el));

    it('form should be invalid when empty', () => {
      expect(component.confirmRestorePasswordForm.valid).toBeFalsy();
    });

    const controlsValidator = (itemValue, controlName, status) => {
      it(`The formControl: ${controlName} should be marked as ${status} if the value is ${itemValue}.`, () => {
        const control = component.confirmRestorePasswordForm.get(controlName);
        control.setValue(itemValue);
        status === 'valid' ? expect(control.valid).toBeTruthy() : expect(control.valid).toBeFalsy();
      });
    };

    validPasswords.forEach((el) => controlsValidator(el, 'password', 'valid'));
    invalidPasswords.forEach((el) => controlsValidator(el, 'password', 'invalid'));
    it('form should be invalid if passwords do not match', () => {
      const passwordControl = component.confirmRestorePasswordForm.get('password');
      passwordControl.setValue('Password12.');
      const confirmPasswordControl = component.confirmRestorePasswordForm.get('confirmPassword');
      confirmPasswordControl.setValue('Password1.');
      expect(component.confirmRestorePasswordForm.valid).toBeFalsy();
    });
  });

  describe('Password hiding text testing:', () => {
    let debug: DebugElement;
    let hiddenEyeDeImg;
    let hiddenEyeDeInput;
    let hiddenEyeImg: HTMLImageElement;
    let hiddenEyeInput: HTMLInputElement;

    beforeEach(() => {
      debug = fixture.debugElement;
      hiddenEyeDeImg = debug.query(By.css('.show-password-img'));
      hiddenEyeDeInput = debug.query(By.css('.password-input'));
      hiddenEyeImg = hiddenEyeDeImg.nativeElement;
      hiddenEyeInput = hiddenEyeDeInput.nativeElement;
    });

    it('should display hiddenEye img', () => {
      fixture.detectChanges();
      expect(hiddenEyeImg.src).toContain(component.authImages.hiddenEye);
    });

    it('should call setPasswordVisibility method', () => {
      spyOn(component, 'setPasswordVisibility');
      hiddenEyeImg.click();
      expect(component.setPasswordVisibility).toHaveBeenCalled();
    });

    it('should change img after setPasswordVisibility call method', () => {
      hiddenEyeImg.click();
      expect(hiddenEyeImg.src).toContain(component.authImages.openEye);
    });

    it('should change type of input after setPasswordVisibility call method', () => {
      hiddenEyeImg.click();
      expect(hiddenEyeInput.type).toEqual('text');

      hiddenEyeImg.click();
      expect(hiddenEyeInput.type).toEqual('password');
    });
  });

  describe('Reset error messages', () => {
    it('Should reset error messages', () => {
      component.passwordErrorMessageBackEnd = 'I am error message';
      component.setPasswordBackendErr();
      expect(component.passwordErrorMessageBackEnd).toBeNull();
    });
  });
});
