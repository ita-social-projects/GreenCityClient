import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { IEmployee, IOrderInfo, IPaymentInfoDto } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { Store, StoreModule } from '@ngrx/store';
import { OrderInfoMockedData, IPaymentInfoDtoMock } from './../../services/orderInfoMock';
import { UbsAdminOrderPaymentComponent } from './ubs-admin-order-payment.component';
import { OrderStatus, PaymnetStatus } from 'src/app/ubs/ubs/order-status.enum';
import { Observable, of } from 'rxjs';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { HttpClient } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { AddPaymentComponent } from '../add-payment/add-payment.component';

describe('UbsAdminOrderPaymentComponent', () => {
  let component: UbsAdminOrderPaymentComponent;
  let fixture: ComponentFixture<UbsAdminOrderPaymentComponent>;
  let storeMock;
  const fakeOrderInfo = OrderInfoMockedData;

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const fakeMatDialog = jasmine.createSpyObj(['close', 'afterClosed']);
  matDialogMock.open.and.returnValue(fakeMatDialog as any);
  fakeMatDialog.afterClosed.and.returnValue(of(true));
  const orderServiceMock = jasmine.createSpyObj('orderService', [
    'getOverpaymentMsg',
    'addPaymentBonuses',
    'saveOrderIdForRefund',
    'getOrderInfo'
  ]);
  orderServiceMock.getOverpaymentMsg.and.returnValue('Overpayment Message');
  orderServiceMock.getOrderInfo.and.returnValue(of(fakeOrderInfo));
  orderServiceMock.addPaymentBonuses = () => new Observable();
  orderServiceMock.saveOrderIdForRefund = () => new Observable();

  const fakeAmountOfBagsConfirmed: Map<string, number> = new Map();
  fakeAmountOfBagsConfirmed.set('1', 1);
  fakeAmountOfBagsConfirmed.set('2', 2);
  fakeAmountOfBagsConfirmed.set('3', 1);

  const returnMoneyDialogDateMock = {
    popupTitle: 'return-payment.message',
    popupConfirm: 'employees.btn.yes',
    popupCancel: 'employees.btn.no',
    style: 'green'
  };

  beforeEach(async(() => {
    storeMock = {
      dispatch: jasmine.createSpy('dispatch')
    };

    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderPaymentComponent, LocalizedCurrencyPipe],
      imports: [MatDialogModule, TranslateModule.forRoot(), StoreModule.forRoot({})],
      providers: [
        { provide: MatDialog, useValue: matDialogMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: MatDialogRef, useValue: fakeMatDialog },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderPaymentComponent);
    component = fixture.componentInstance;
    component.orderInfo = fakeOrderInfo;
    component.paymentsArray = fakeOrderInfo.paymentTableInfoDto.paymentInfoDtos;
    component.orderStatus = 'Formed';
    component.pageOpen = false;
    component.overpayment = 700;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('life cycle hook ngOnInit', () => {
    const spy = spyOn(component, 'setDateInPaymentArray');
    const spy2 = spyOn(component, 'positivePaymentsArrayAmount');
    component.ngOnInit();
    const sumDiscount = component.orderInfo.orderBonusDiscount + component.orderInfo.orderCertificateTotalDiscount;
    expect(component.orderId).toBe(1);
    expect(component.paymentInfo).toBe(fakeOrderInfo.paymentTableInfoDto);
    expect(component.paymentsArray).toBe(fakeOrderInfo.paymentTableInfoDto.paymentInfoDtos);
    expect(component.paymentInfo).toBe(fakeOrderInfo.paymentTableInfoDto);
    expect(component.paidAmount).toBe(component.paymentInfo.paidAmount);
    expect(component.unPaidAmount).toBe(component.paymentInfo.unPaidAmount);
    expect(component.currentOrderStatus).toBe('Formed');
    expect(component.overpayment).toBe(component.paymentInfo.overpayment);
    expect(sumDiscount).toBe(0);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('method formatDate', () => {
    expect(component.formatDate('2020-07-02')).toBe('02.07.2020');
  });

  it('method setDateInPaymentArray', () => {
    const fakeSettlementdateArray: string[] = ['2022-02-01', '2022-08-22', '2020-02-18'];
    component.setDateInPaymentArray(component.paymentsArray);
    for (let i = 0; i < component.paymentsArray.length; i++) {
      expect(component.paymentsArray[i].settlementdate).toBe(component.formatDate(fakeSettlementdateArray[i]));
    }
  });

  it('method openDetails', () => {
    component.pageOpen = false;
    component.openDetails();
    expect(component.pageOpen).toBeTruthy();
    expect(component.pageOpen).toBe(true);
  });

  it('method recountUnpaidAmount', () => {
    component.recountUnpaidAmount(200);
    expect(component.unPaidAmount).toBe(450);
    component.recountUnpaidAmount(1000);
    expect(component.unPaidAmount).toBe(0);
  });

  it('method setOverpayment', () => {
    const fakeModuleOverPayment = Math.abs(component.overpayment);
    component.setOverpayment(component.overpayment);

    expect(orderServiceMock.getOverpaymentMsg).toHaveBeenCalledWith(component.overpayment);
    expect(component.overpayment).toBe(fakeModuleOverPayment);
  });

  it('method returnMoney', () => {
    const orderId = 137;
    component.returnMoney(orderId);
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(matDialogMock.open).toHaveBeenCalledWith(DialogPopUpComponent, {
      hasBackdrop: true,
      data: returnMoneyDialogDateMock,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: ''
    });
  });

  it('method openPopup', () => {
    const viewMode = true;
    const paymentIndex = 3;
    component.openPopup(viewMode);
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(matDialogMock.open).toHaveBeenCalledWith(AddPaymentComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'custom-dialog-container',
      height: '100%',
      data: {
        orderId: 1,
        viewMode,
        payment: viewMode ? component.paymentsArray[paymentIndex] : null,
        isCanPaymentEdit: component.isOrderCanBePaid
      }
    });
  });

  it('method isOverpaymentReturnAvailable', () => {
    expect(component.isOverpaymentReturnAvailable()).toBeFalsy();
    component.currentOrderStatus = OrderStatus.CANCELED;
    expect(component.isOverpaymentReturnAvailable()).toBeTruthy();
  });

  it('method positivePaymentsArrayAmount', () => {
    component.positivePaymentsArrayAmount();
    component.paymentsArray.forEach((payment: IPaymentInfoDto) => {
      expect(payment.amount).toBeGreaterThan(0);
    });
  });

  it('method postDataItem', () => {
    (component as any).postDataItem(250, PaymnetStatus.PAID);

    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('method getStringDate', () => {
    const currentTime: Date = new Date();
    const formatDate: string = currentTime
      .toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .split('/')
      .reverse()
      .join('-');
    expect(component.getStringDate(currentTime)).toBe(formatDate);
  });

  it('method displayUnpaidAmount', () => {
    component.unPaidAmount = 0;
    component.currentOrderStatus = OrderStatus.CANCELED;
    expect(component.displayUnpaidAmount()).toBeFalsy();
  });

  it('method setCancelOrderOverpayment', () => {
    const sum = 250;
    component.setCancelOrderOverpayment(sum);
    expect(component.overpayment).toBe(250);
  });

  it('method preconditionChangePaymentData', () => {
    const spy = spyOn(component, 'recountUnpaidAmount');
    component.preconditionChangePaymentData(IPaymentInfoDtoMock);
    expect(spy).toHaveBeenCalledWith(IPaymentInfoDtoMock.amount);
  });

  it('should update overpayment message and value in ngOnChanges when orderStatus changes', () => {
    component.orderStatus = 'In Progress';
    component.totalPaid = 480;
    const previousStutusValue = 'In Progress';
    const currentStatusValue = 'Completed';
    const currentOverpaymentValue = 0;
    const previousOverpaymentValue = 200;
    const isFirstChange = false;

    const SimpleChangesMock = {
      orderStatus: new SimpleChange(previousStutusValue, currentStatusValue, isFirstChange),
      overpayment: new SimpleChange(currentOverpaymentValue, previousOverpaymentValue, isFirstChange)
    };

    component.ngOnChanges(SimpleChangesMock);

    expect(component.currentOrderStatus).toBe('Completed');
    expect(orderServiceMock.getOverpaymentMsg).toHaveBeenCalledWith(480);
    expect(component.message).toBe('Overpayment Message');
    expect(component.overpayment).toBe(480);
  });

  it('should update positive amount value in the paymentsArray correctly', () => {
    component.paymentsArray = [
      { id: 1, amount: -100, settlementdate: '2022-12-31', currentDate: '2022-12-31', receiptLink: '' },
      { id: 2, amount: -200, settlementdate: '2022-12-31', currentDate: '2022-12-31', receiptLink: '' },
      { id: 3, amount: -300, settlementdate: '2022-12-31', currentDate: '2022-12-31', receiptLink: '' }
    ];
    component.positivePaymentsArrayAmount();

    expect(component.paymentsArray[0].amount).toBe(100);
    expect(component.paymentsArray[1].amount).toBe(200);
    expect(component.paymentsArray[2].amount).toBe(300);
  });
});
