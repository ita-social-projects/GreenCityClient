import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { UbsAdminOrderClientInfoComponent } from './ubs-admin-order-client-info.component';
import { AbstractControl, FormGroup } from '@angular/forms';

fdescribe('UbsAdminOrderClientInfoComponent', () => {
  let component: UbsAdminOrderClientInfoComponent;
  let fixture: ComponentFixture<UbsAdminOrderClientInfoComponent>;
  const fakeUserInfo = {
    customerEmail: 'nazar@gmail.com',
    customerName: 'Ivan',
    customerPhoneNumber: '380963423532',
    customerSurName: 'Taras',
    recipientEmail: 'nazar@gmail.com',
    recipientId: 259,
    recipientName: 'Nazar',
    recipientPhoneNumber: '380963423532',
    recipientSurName: 'Taras',
    totalUserViolations: 5,
    userViolationForCurrentOrder: 2
  };

  const fakeFormGroup = {
    controls: { recipientPhoneNumber: {} }
  } as unknown as FormGroup;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TranslateModule.forRoot()],
      declarations: [UbsAdminOrderClientInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderClientInfoComponent);
    component = fixture.componentInstance;
    component.userInfo = fakeUserInfo;
    component.userInfoDto = fakeFormGroup;
    component.orderId = 259;
    component.pageOpen = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('life cycle hook ngOnInit', () => {
    component.ngOnInit();
    expect(component.pageOpen).toBeTruthy();
    expect(component.totalUserViolations).toBe(5);
    expect(component.userViolationForCurrentOrder).toBe(2);
  });

  it('method openDetails', () => {
    component.openDetails();
    expect(component.pageOpen).toBeFalsy();
  });

  it('method setViolationData', () => {
    component.setViolationData();
    expect(component.totalUserViolations).toBe(5);
    expect(component.userViolationForCurrentOrder).toBe(2);
  });

  it('method getErrorMessageKey should return correct error message key - required', () => {
    const formControlMock = { errors: { required: true } } as unknown as AbstractControl;

    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe('input-error.required');
  });

  it('method getErrorMessageKey should return correct error message key - required', () => {
    const formControlMock = { errors: { pattern: true } } as unknown as AbstractControl;

    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe('input-error.number-length');
  });

  it('method getErrorMessageKey should return correct error message key - required', () => {
    const formControlMock = { errors: { maxlength: true } } as unknown as AbstractControl;

    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe('input-error.max-length');
  });

  it('method getErrorMessageKey should return correct error message key - required', () => {
    const formControlMock = { errors: { pattern: true } } as unknown as AbstractControl;

    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe('input-error.pattern');
  });

  it('method getErrorMessageKey should return correct error message key - empty message key', () => {
    const formControlMock = { errors: {} } as unknown as AbstractControl;

    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe(undefined);
  });
});
