import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { UbsAdminOrderClientInfoComponent } from './ubs-admin-order-client-info.component';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { OrderInfoMockedData } from '../../services/orderInfoMock';

fdescribe('UbsAdminOrderClientInfoComponent', () => {
  let component: UbsAdminOrderClientInfoComponent;
  let fixture: ComponentFixture<UbsAdminOrderClientInfoComponent>;
  let changes: SimpleChanges;

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
    component.userInfoDto = fakeFormGroup;
    component.orderId = 259;
    component.pageOpen = true;
    changes = {
      orderStatus: new SimpleChange(null, OrderStatus.DONE, true)
    };
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
    const spy = spyOn(component, 'ngOnInit');
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

  it('should update isOrderDone if orderStatus is DONE', () => {
    component.ngOnChanges(changes);
    expect(component.isOrderDone).toBeTruthy();
    expect(component.isOrderCanceled).toBeFalsy();
    expect(component.isOrderNotTakenOut).toBeFalsy();
  });

  it('should update isOrderCanceled if orderStatus is CANCELED', () => {
    changes.orderStatus.currentValue = OrderStatus.CANCELED;
    changes.orderStatus.previousValue = OrderStatus.DONE;
    changes.orderStatus.firstChange = false;
    component.ngOnChanges(changes);
    expect(component.isOrderDone).toBeFalsy();
    expect(component.isOrderCanceled).toBeTruthy();
    expect(component.isOrderNotTakenOut).toBeFalsy();
  });

  it('should update isOrderNotTakenOut if orderStatus is NOT_TAKEN_OUT', () => {
    changes.orderStatus.currentValue = OrderStatus.NOT_TAKEN_OUT;
    changes.orderStatus.previousValue = OrderStatus.CANCELED;
    changes.orderStatus.firstChange = false;
    component.ngOnChanges(changes);
    expect(component.isOrderDone).toBeFalsy();
    expect(component.isOrderCanceled).toBeFalsy();
    expect(component.isOrderNotTakenOut).toBeTruthy();
  });

  it('statuses should be false if orderStatus is not defined', () => {
    changes.orderStatus.currentValue = null;
    changes.orderStatus.previousValue = OrderStatus.NOT_TAKEN_OUT;
    changes.orderStatus.firstChange = false;
    component.ngOnChanges(changes);
    expect(component.isOrderDone).toBeFalsy();
    expect(component.isOrderCanceled).toBeFalsy();
    expect(component.isOrderNotTakenOut).toBeFalsy();
  });
});
