import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UbsAdminOrderClientInfoComponent } from './ubs-admin-order-client-info.component';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

describe('UbsAdminOrderClientInfoComponent', () => {
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

  const fakeFormGroup = new FormGroup({
    recipientPhoneNumber: new FormControl(),
    recipientName: new FormControl(),
    recipientSurName: new FormControl(),
    recipientEmail: new FormControl()
  });

  const GeneralInfoFake = {
    orderStatus: 'DONE',
    adminComment: 'Admin',
    orderPaymentStatus: 'PAID',
    orderStatusesDtos: [
      { ableActualChange: false, key: 'DONE', translation: 'Formed' },
      { ableActualChange: false, key: 'ADJUSTMENT', translation: 'Adjustment' },
      { ableActualChange: false, key: 'BROUGHT_IT_HIMSELF', translation: 'Brought by himself' },
      { ableActualChange: true, key: 'CANCELED', translation: 'Canceled' }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, NoopAnimationsModule, TranslateModule.forRoot()],
      declarations: [UbsAdminOrderClientInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderClientInfoComponent);
    component = fixture.componentInstance;
    component.userInfo = fakeUserInfo;
    component.generalInfo = GeneralInfoFake as any;
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

  it('method onDefineOrderStatus', () => {
    const spy = spyOn(component, 'onDefineOrderStatus');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('method getErrorMessageKey should return correct error message key - required', () => {
    const formControlMock = { errors: { required: true } } as unknown as AbstractControl;
    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe('input-error.required');
  });

  it('method getErrorMessageKey should return correct error message key - pattern', () => {
    const formControlMock = { errors: { pattern: true } } as unknown as AbstractControl;
    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe('input-error.pattern');
  });

  it('method getErrorMessageKey should return correct error message key - maxlength', () => {
    const formControlMock = { errors: { maxlength: true } } as unknown as AbstractControl;
    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe('input-error.max-length');
  });

  it('method getErrorMessageKey should return correct error message key - empty message key', () => {
    const formControlMock = { errors: {} } as unknown as AbstractControl;

    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe(undefined);
  });
});
