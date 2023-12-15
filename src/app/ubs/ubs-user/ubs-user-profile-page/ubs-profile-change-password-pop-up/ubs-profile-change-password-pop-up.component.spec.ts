import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ChangePasswordService } from '@global-service/auth/change-password.service';
import { UntypedFormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UpdatePasswordDto } from '@global-models/updatePasswordDto';
import { of } from 'rxjs';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('UbsProfileChangePasswordPopUpComponent', () => {
  let component: UbsProfileChangePasswordPopUpComponent;
  let fixture: ComponentFixture<UbsProfileChangePasswordPopUpComponent>;
  const currentPassword = 'currentPassword';
  const password = 'password';
  const confirmPassword = 'confirmPassword';

  const changePasswordServiceFake = jasmine.createSpyObj('ChangePasswordService', ['changePassword']);
  changePasswordServiceFake.changePassword.and.returnValue(of({}));
  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsProfileChangePasswordPopUpComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ChangePasswordService, useValue: changePasswordServiceFake },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        UntypedFormBuilder
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
});
