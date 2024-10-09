import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { IPaymentInfoDto } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { OrderInfoMockedData } from './../../services/orderInfoMock';
import { UbsAdminOrderPaymentComponent } from './ubs-admin-order-payment.component';

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

  beforeEach(waitForAsync(() => {
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
    const formBuilder: FormBuilder = TestBed.inject(FormBuilder);
    component.orderForm = formBuilder.group({
      someControl: ['']
    });
    component.paymentsArray = fakeOrderInfo.paymentTableInfoDto.paymentInfoDtos;
    component.orderStatus = 'Formed';
    component.pageOpen = false;
    component.overpayment = 700;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method formatDate', () => {
    expect(component.formatDate('2020-07-02')).toBe('02.07.2020');
  });

  it('method setDateInPaymentArray', () => {
    const fakeSettlementdateArray: string[] = ['2022-02-01', '2022-08-22', '2020-02-18'];
    component.paymentsArray = [
      { id: 0, currentDate: '2022-02-01', amount: 0, settlementdate: '2022-02-01', receiptLink: '' },
      { id: 1, currentDate: '2022-08-22', amount: 0, settlementdate: '2022-08-22', receiptLink: '' },
      { id: 2, currentDate: '2020-02-18', amount: 0, settlementdate: '2020-02-18', receiptLink: '' }
    ];
    component.setDateInPaymentArray();
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

  it('method returnMoney', () => {
    component.returnMoney();
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
    component.orderId = 1;
    component.openPopup(true);
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
    component.overpayment = 100;
    component.isStatusForReturnMoneyOrPaid = true;
    expect(component.isOverpaymentReturnAvailable()).toBeTruthy();
  });

  it('method positivePaymentsArrayAmount', () => {
    component.positivePaymentsArrayAmount();
    component.paymentsArray.forEach((payment: IPaymentInfoDto) => {
      expect(payment.amount).toBeGreaterThan(0);
    });
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
