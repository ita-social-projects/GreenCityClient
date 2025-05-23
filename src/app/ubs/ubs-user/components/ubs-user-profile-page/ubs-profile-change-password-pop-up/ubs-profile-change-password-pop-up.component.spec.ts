import { ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangePasswordService } from 'src/app/shared/services/auth/change-password.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UpdatePasswordDto } from 'src/app/shared/models/updatePasswordDto';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

describe('UbsProfileChangePasswordPopUpComponent', () => {
  let component: UbsProfileChangePasswordPopUpComponent;
  let fixture: ComponentFixture<UbsProfileChangePasswordPopUpComponent>;
  const currentPassword = 'currentPassword';
  const password = 'password';
  const confirmPassword = 'confirmPassword';

  const changePasswordServiceFake = jasmine.createSpyObj('ChangePasswordService', ['changePassword']);
  changePasswordServiceFake.changePassword.and.returnValue(of({}));
  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsProfileChangePasswordPopUpComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ChangePasswordService, useValue: changePasswordServiceFake },
        { provide: MatSnackBarService, useValue: MatSnackBarMock },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsProfileChangePasswordPopUpComponent);
    component = fixture.componentInstance;
    component.data.hasPassword = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.formConfig.valid).toBeFalsy();
  });
  it('ngOnint calls initForm()', () => {
    const spyInitForm = spyOn(component, 'initForm');
    component.ngOnInit();
    expect(spyInitForm).toHaveBeenCalled();
  });

  it('initForm should create', () => {
    component.hasPassword = true;
    const initFormFake = {
      currentPassword: '',
      password: '',
      confirmPassword: ''
    };

    component.initForm();
    expect(component.formConfig.value).toEqual(initFormFake);
  });

  it('submitting a form', () => {
    expect(component.formConfig.valid).toBeFalsy();
    component.formConfig.controls[currentPassword].setValue('Qwerty132!');
    component.formConfig.controls[password].setValue('Test!2334');
    component.formConfig.controls[confirmPassword].setValue('Test!2334');
    expect(component.formConfig.valid).toBeTruthy();

    const updatePasswordDto: UpdatePasswordDto = component.formConfig.value;

    component.onSubmit();
    expect(updatePasswordDto.currentPassword).toBe('Qwerty132!');
    expect(updatePasswordDto.password).toBe('Test!2334');
    expect(updatePasswordDto.confirmPassword).toBe('Test!2334');
  });

  it('error message "password is longer than 20 characters" should not be displayed', () => {
    (MatSnackBarMock.openSnackBar as jasmine.Spy).calls.reset();

    component.formConfig.controls[currentPassword].setValue('Qwerty132!');
    component.formConfig.controls[password].setValue('Test!2334');
    component.formConfig.controls[confirmPassword].setValue('Test!2334');

    component.onSubmit();

    expect(MatSnackBarMock.openSnackBar).not.toHaveBeenCalledWith('errorPasswordChange');
  });

  it('error message "password is longer than 20 characters" should be displayed', () => {
    (MatSnackBarMock.openSnackBar as jasmine.Spy).calls.reset();

    component.formConfig.controls[currentPassword].setValue('Qwerty132!');
    component.formConfig.controls[password].setValue('Test!2334Test!2334Test!2st!2334Test!2334Test!2334Test!2334Tesst');
    component.formConfig.controls[confirmPassword].setValue('Test!2334Test!2334Test!2st!2334Test!2334Test!2334Test!2334Tesst');

    component.onSubmit();

    expect(MatSnackBarMock.openSnackBar).toHaveBeenCalledWith('errorPasswordChange');
  });
});
