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

  const generalOrderInfoMock = {
    id: 1,
    dateFormed: '2022-02-08T15:21:44.85458',
    adminComment: null,
    orderStatus: 'FORMED',
    orderStatusName: 'Сформовано',
    orderStatusNameEng: 'Formed',
    orderStatusesDtos: [
      {
        ableActualChange: false,
        key: 'FORMED',
        translation: 'Сформовано'
      },
      {
        ableActualChange: false,
        key: 'ADJUSTMENT',
        translation: 'Узгодження'
      },
      {
        ableActualChange: false,
        key: 'BROUGHT_IT_HIMSELF',
        translation: 'Привезе сам'
      },
      {
        ableActualChange: false,
        key: 'CONFIRMED',
        translation: 'Підтверджено'
      },
      {
        ableActualChange: false,
        key: 'ON_THE_ROUTE',
        translation: 'На маршруті'
      },
      {
        ableActualChange: true,
        key: 'DONE',
        translation: 'Виконано'
      },
      {
        ableActualChange: false,
        key: 'NOT_TAKEN_OUT',
        translation: 'Не вивезли'
      },
      {
        ableActualChange: true,
        key: 'CANCELED',
        translation: 'Скасовано'
      }
    ],
    orderPaymentStatus: 'PAID',
    orderPaymentStatusName: 'Оплачено',
    orderPaymentStatusNameEng: 'Paid',
    orderPaymentStatusesDto: [
      {
        key: 'PAID',
        translation: 'Оплачено'
      }
    ]
  };
  const OrderStatusInfoFake = {
    key: 'fakeKey',
    ableActualChange: 'true'
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
    component.generalInfo = generalOrderInfoMock as any;
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

  it('should set isStatus to false when orderStatus is not "CANCELED"', () => {
    component.generalInfo.orderStatus = 'CANCELED';
    component.isStatus = false;
    component.onDefineOrderStatus();
    expect(component.isStatus).toBe(true);
  });

  it('should set isStatus to true when orderStatus is "CANCELED"', () => {
    component.generalInfo.orderStatus = 'DONE';
    component.isStatus = false;
    component.onDefineOrderStatus();
    expect(component.isStatus).toBe(false);
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
