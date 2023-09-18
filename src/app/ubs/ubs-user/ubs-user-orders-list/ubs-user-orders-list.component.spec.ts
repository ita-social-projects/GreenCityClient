import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UbsUserOrdersListComponent } from './ubs-user-orders-list.component';
import { HttpClientModule } from '@angular/common/http';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { IOrderState } from 'src/app/store/state/order.state';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';

describe('UbsUserOrdersListComponent', () => {
  let component: UbsUserOrdersListComponent;
  let fixture: ComponentFixture<UbsUserOrdersListComponent>;

  const matDialogMock = jasmine.createSpyObj('dialog', ['open']);
  const fakeIputOrderData = [
    { id: 3, dateForm: 55, orderStatusEng: 'Done', paymentStatusEng: 'Unpaid', orderFullPrice: 55, amountBeforePayment: 55, extend: true },
    {
      id: 7,
      dateForm: 66,
      orderStatusEng: 'Formed',
      paymentStatusEng: 'Half paid',
      orderFullPrice: 0,
      amountBeforePayment: 55,
      extend: false
    },
    {
      id: 1,
      dateForm: 11,
      orderStatusEng: 'Canceled',
      paymentStatusEng: 'Paid',
      orderFullPrice: -55,
      amountBeforePayment: 55,
      extend: false
    },
    {
      id: 12,
      dateForm: 15,
      orderStatusEng: 'Adjustment',
      paymentStatusEng: 'Unpaid',
      orderFullPrice: 55,
      amountBeforePayment: 55,
      extend: false
    }
  ];
  const fakePoints = 111;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue.and.returnValue('fakeValue');

  const initialOrderState: IOrderState = {
    orderDetails: null,
    personalData: null,
    error: null
  };

  const ubsOrderServiseMock = {
    orderDetails: null,
    personalData: null,
    error: null
  };
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrdersListComponent, LocalizedCurrencyPipe],
      imports: [
        MatDialogModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        StoreModule.forRoot({})
      ],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: Store, useValue: storeMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserOrdersListComponent);
    component = fixture.componentInstance;
    component.bonuses = fakePoints;
    component.orders = JSON.parse(JSON.stringify(fakeIputOrderData)) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sortingOrdersByData should be called in ngOnInit', () => {
    const sortingOrdersByDataSpy = spyOn(component, 'sortingOrdersByData');
    component.ngOnInit();
    expect(sortingOrdersByDataSpy).toHaveBeenCalled();
  });

  it('should set value from lang service', () => {
    const value = component.getLangValue('fakeValue', 'fakeValueEn');
    expect(value).toBe('fakeValue');
  });

  describe('isOrderUnpaid', () => {
    it('order is unpaid', () => {
      const isOrderPaidRes = component.isOrderUnpaid(fakeIputOrderData[0] as any);
      expect(isOrderPaidRes).toBeTruthy();
    });

    it('order is not unpaid', () => {
      const isOrderPaidRes = component.isOrderUnpaid(fakeIputOrderData[1] as any);
      expect(isOrderPaidRes).toBeFalsy();
    });
  });

  describe('isOrderHalfPaid', () => {
    it('order is half paid', () => {
      const isOrderHalfPaidRes = component.isOrderHalfPaid(fakeIputOrderData[1] as any);
      expect(isOrderHalfPaidRes).toBeTruthy();
    });

    it('order is not half paid', () => {
      const isOrderHalfPaidRes = component.isOrderHalfPaid(fakeIputOrderData[2] as any);
      expect(isOrderHalfPaidRes).toBeFalsy();
    });
  });

  describe('isOrderPriceGreaterThenZero', () => {
    it('price is greater then zero', () => {
      const isOrderPriceGreaterThenZeroRes = component.isOrderPriceGreaterThenZero(fakeIputOrderData[0] as any);
      expect(isOrderPriceGreaterThenZeroRes).toBeTruthy();
    });

    it('price is less then zero', () => {
      const isOrderPriceGreaterThenZeroRes = component.isOrderPriceGreaterThenZero(fakeIputOrderData[2] as any);
      expect(isOrderPriceGreaterThenZeroRes).toBeFalsy();
    });
  });

  describe('isOrderPaymentAccess', () => {
    it('isOrderPriceGreaterThenZero and isOrderPaid are true', () => {
      spyOn(component, 'isOrderPriceGreaterThenZero').and.returnValue(true);
      spyOn(component, 'isOrderUnpaid').and.returnValue(true);
      const isOrderPaymentAccessRes = component.isOrderPaymentAccess(fakeIputOrderData[0] as any);
      expect(isOrderPaymentAccessRes).toBeFalsy();
    });

    it('isOrderPriceGreaterThenZero and isOrderHalfPaid are true', () => {
      spyOn(component, 'isOrderPriceGreaterThenZero').and.returnValue(true);
      spyOn(component, 'isOrderHalfPaid').and.returnValue(true);
      const isOrderPaymentAccessRes = component.isOrderPaymentAccess(fakeIputOrderData[1] as any);
      expect(isOrderPaymentAccessRes).toBeTruthy();
    });

    it('isOrderPriceGreaterThenZero is false', () => {
      spyOn(component, 'isOrderPriceGreaterThenZero').and.returnValue(false);
      const isOrderPaymentAccessRes = component.isOrderPaymentAccess(fakeIputOrderData[2] as any);
      expect(isOrderPaymentAccessRes).toBeFalsy();
    });

    it('canOrderBeCancel return false', () => {
      spyOn(component, 'canOrderBeCancel').and.returnValue(false);
      const canOrderBeCancel = component.canOrderBeCancel(fakeIputOrderData[3] as any);
      expect(canOrderBeCancel).toBeFalsy();
    });

    it('canOrderBeCancel return true', () => {
      spyOn(component, 'canOrderBeCancel').and.returnValue(true);
      const canOrderBeCancel = component.canOrderBeCancel(fakeIputOrderData[1] as any);
      expect(canOrderBeCancel).toBeTruthy();
    });
  });

  describe('changeCard', () => {
    it('makes expected calls', () => {
      component.changeCard(7);
      expect(component.orders[0].extend).toBeTruthy();
      expect(component.orders[1].extend).toBeFalsy();
      expect(component.orders[2].extend).toBeFalsy();
    });
  });

  describe('openOrderPaymentDialog', () => {
    it('makes expected calls', () => {
      component.openOrderPaymentDialog(fakeIputOrderData[1] as any);
      expect(matDialogMock.open).toHaveBeenCalledWith(UbsUserOrderPaymentPopUpComponent, {
        maxWidth: '500px',
        panelClass: 'ubs-user-order-payment-pop-up-vertical-scroll',
        data: {
          orderId: 7,
          price: 55,
          bonuses: 111
        }
      });
    });
  });

  describe('openOrderCancelDialog', () => {
    it('makes expected calls', () => {
      component.openOrderCancelDialog(fakeIputOrderData[0] as any);
      expect(matDialogMock.open).toHaveBeenCalled();
    });
  });

  describe('sortingOrdersByData', () => {
    it('sort orsers data', () => {
      const resultOrderData = [
        {
          id: 7,
          dateForm: 66,
          orderStatusEng: 'Formed',
          paymentStatusEng: 'Half paid',
          orderFullPrice: 0,
          amountBeforePayment: 55,
          extend: false
        },
        {
          id: 3,
          dateForm: 55,
          orderStatusEng: 'Done',
          paymentStatusEng: 'Unpaid',
          orderFullPrice: 55,
          amountBeforePayment: 55,
          extend: true
        },
        {
          id: 12,
          dateForm: 15,
          orderStatusEng: 'Adjustment',
          paymentStatusEng: 'Unpaid',
          orderFullPrice: 55,
          amountBeforePayment: 55,
          extend: false
        },
        {
          id: 1,
          dateForm: 11,
          orderStatusEng: 'Canceled',
          paymentStatusEng: 'Paid',
          orderFullPrice: -55,
          amountBeforePayment: 55,
          extend: false
        }
      ];
      component.sortingOrdersByData();
      expect(component.orders).toEqual(resultOrderData as any);
    });
  });
});
