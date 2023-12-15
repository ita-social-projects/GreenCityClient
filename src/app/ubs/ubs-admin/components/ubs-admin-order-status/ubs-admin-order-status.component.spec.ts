import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GeneralInfoMock } from '../../services/orderInfoMock';
import { OrderService } from '../../services/order.service';
import { AddOrderCancellationReasonComponent } from '../add-order-cancellation-reason/add-order-cancellation-reason.component';
import { UbsAdminOrderStatusComponent } from './ubs-admin-order-status.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { OrderStatus, PaymnetStatus } from 'src/app/ubs/ubs/order-status.enum';

describe('UbsAdminOrderStatusComponent', () => {
  let component: UbsAdminOrderStatusComponent;
  let fixture: ComponentFixture<UbsAdminOrderStatusComponent>;

  const OrderServiceFake = {
    getAvailableOrderStatuses: jasmine.createSpy('getAvailableOrderStatuses')
  };

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const dialogRefStubCancel = {
    afterClosed() {
      return of({ action: 'cancel', reason: 'OTHER', comment: 'coment' });
    }
  };
  const dialogRefStubOther = {
    afterClosed() {
      return of({ action: false, reason: 'OTHER', comment: 'coment' });
    }
  };
  const data = {
    isHistory: false
  };

  const FormGroupMock = new UntypedFormGroup({
    orderStatus: new UntypedFormControl(''),
    paymentStatus: new UntypedFormControl(''),
    adminComment: new UntypedFormControl(''),
    cancellationReason: new UntypedFormControl(''),
    cancellationComment: new UntypedFormControl('')
  });

  const GeneralInfoFake = GeneralInfoMock;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue.and.returnValue('value');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderStatusComponent],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: OrderServiceFake },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: LanguageService, useValue: languageServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderStatusComponent);
    component = fixture.componentInstance;
    component.generalInfo = GeneralInfoFake as any;
    component.generalOrderInfo = FormGroupMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges should call setOrderPaymentStatus once', () => {
    component.currentOrderPrice = 2;
    spyOn(component, 'setOrderPaymentStatus');
    component.ngOnChanges({
      currentOrderPrice: true,
      generalInfo: {
        currentValue: {
          orderStatus: false
        }
      }
    } as any);
    expect(component.setOrderPaymentStatus).toHaveBeenCalled();
  });

  it('getAvailableOrderStatuses should been called once ', () => {
    OrderServiceFake.getAvailableOrderStatuses.calls.reset();
    component.ngOnInit();
    expect(component.orderService.getAvailableOrderStatuses).toHaveBeenCalledTimes(1);
  });

  it('onChangedOrderStatus should call changedOrderStatus and openPopup', () => {
    spyOn(component, 'openPopup');
    spyOn(component.changedOrderStatus, 'emit');

    component.onChangedOrderStatus(OrderStatus.CANCELED);
    expect(component.changedOrderStatus.emit).toHaveBeenCalled();
    expect(component.openPopup).toHaveBeenCalledTimes(1);
  });

  it('openPopup  dialog.open should been called with arguments and onChangedOrderStatus called once', () => {
    spyOn(component, 'onChangedOrderStatus');
    matDialogMock.open.and.returnValue(dialogRefStubCancel as any);
    component.openPopup();
    expect(component.onChangedOrderStatus).toHaveBeenCalledTimes(1);
  });

  it('openPopup  dialog.open should been called and pass res.Reason', () => {
    spyOn(component, 'onChangedOrderStatus');
    matDialogMock.open.and.returnValue(dialogRefStubOther as any);
    component.openPopup();
    expect((component as any).dialog.open).toHaveBeenCalledWith(AddOrderCancellationReasonComponent, {
      hasBackdrop: true,
      data
    });
  });

  it('setOrderPaymentStatus orderState shold be "confirmed" and should return orderPayment status UNPAID when order was not payed', () => {
    GeneralInfoFake.orderStatusesDtos[0].ableActualChange = false;
    component.currentOrderPrice = 1;
    component.totalPaid = 0;
    component.unPaidAmount = 1;
    component.setOrderPaymentStatus();
    expect(GeneralInfoFake.orderPaymentStatus).toBe(PaymnetStatus.UNPAID);
  });

  it('setOrderPaymentStatus orderState shold be "confirmed" and should return orderPayment status UNPAID when unpaid amount is', () => {
    GeneralInfoFake.orderStatusesDtos[0].ableActualChange = false;
    component.currentOrderPrice = 0;
    component.totalPaid = 0;
    component.unPaidAmount = 1;
    component.setOrderPaymentStatus();
    expect(GeneralInfoFake.orderPaymentStatus).toBe(PaymnetStatus.UNPAID);
  });

  it('setOrderPaymentStatus orderState shold be "confirmed" and should return orderPayment status HALF_PAID', () => {
    GeneralInfoFake.orderStatusesDtos[0].ableActualChange = false;
    component.currentOrderPrice = 2;
    component.totalPaid = 1;
    component.unPaidAmount = 1;
    component.setOrderPaymentStatus();
    expect(GeneralInfoFake.orderPaymentStatus).toBe(PaymnetStatus.HALF_PAID);
  });

  it('setOrderPaymentStatus orderState shold be "confirmed" and should return orderPayment status PAID when paid sum is', () => {
    GeneralInfoFake.orderStatusesDtos[0].ableActualChange = false;
    component.currentOrderPrice = 0;
    component.totalPaid = 1;
    component.unPaidAmount = 0;
    component.setOrderPaymentStatus();
    expect(GeneralInfoFake.orderPaymentStatus).toBe(PaymnetStatus.PAID);
  });

  it('setOrderPaymentStatus orderState "confirmed" and should return orderPayment status PAID when paid sum equal order price', () => {
    GeneralInfoFake.orderStatusesDtos[0].ableActualChange = false;
    component.currentOrderPrice = 1;
    component.totalPaid = 1;
    component.unPaidAmount = 0;
    component.setOrderPaymentStatus();
    expect(GeneralInfoFake.orderPaymentStatus).toBe(PaymnetStatus.PAID);
  });

  it('setOrderPaymentStatus orderState should be "confirmed" and should return orderPayment status PAID when all sum are 0', () => {
    GeneralInfoFake.orderStatusesDtos[0].ableActualChange = false;
    component.currentOrderPrice = 0;
    component.totalPaid = 0;
    component.unPaidAmount = 0;
    component.setOrderPaymentStatus();
    expect(GeneralInfoFake.orderPaymentStatus).toBe(PaymnetStatus.PAID);
  });

  it('setOrderPaymentStatus orderState shold be "actual" and should return orderPayment status UNPAID', () => {
    GeneralInfoFake.orderStatusesDtos[0].ableActualChange = true;
    component.currentOrderPrice = 0;
    component.totalPaid = 0;
    component.unPaidAmount = 1;
    component.setOrderPaymentStatus();
    expect(GeneralInfoFake.orderPaymentStatus).toBe(PaymnetStatus.UNPAID);
  });

  it('setOrderPaymentStatus orderState shold be "actual" and should return orderPayment status PAID', () => {
    GeneralInfoFake.orderStatusesDtos[0].ableActualChange = true;
    component.currentOrderPrice = 0;
    component.totalPaid = 1;
    component.unPaidAmount = 0;
    component.setOrderPaymentStatus();
    expect(GeneralInfoFake.orderPaymentStatus).toBe(PaymnetStatus.PAID);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy$ = new Subject<boolean>();
    spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect((component as any).destroy$.complete).toHaveBeenCalledTimes(1);
  });

  it('should return ua value by getLangValue', () => {
    const value = component.getLangValue('value', 'enValue');
    expect(value).toBe('value');
  });
});
