import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedCurrencyPipe } from '@ubs/shared/pipes/localized-currency-pipe/localized-currency.pipe';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UbsUserOrdersListComponent } from './ubs-user-orders-list.component';
import { HttpClientModule } from '@angular/common/http';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { UbsSharedModule } from '@ubs/shared/ubs-shared.module';
import { OrderStatusEn } from './models/UserOrder.interface';
import { DialogPopUpComponent } from 'src/app/shared/components/dialog-pop-up/dialog-pop-up.component';

describe('UbsUserOrdersListComponent', () => {
  let component: UbsUserOrdersListComponent;
  let fixture: ComponentFixture<UbsUserOrdersListComponent>;

  const matDialogMock = jasmine.createSpyObj('dialog', ['open']);
  const fakeIputOrderData = [
    { id: 3, dateForm: 55, orderStatusEn: 'Done', paymentStatusEn: 'Unpaid', orderFullPrice: 55, amountBeforePayment: 55, extend: true },
    {
      id: 7,
      dateForm: 66,
      orderStatusEn: 'Formed',
      paymentStatusEn: 'Half paid',
      orderFullPrice: 0,
      amountBeforePayment: 55,
      extend: false
    },
    {
      id: 1,
      dateForm: 11,
      orderStatusEn: 'Canceled',
      paymentStatusEn: 'Paid',
      orderFullPrice: -55,
      amountBeforePayment: 55,
      extend: false
    },
    {
      id: 12,
      dateForm: 15,
      orderStatusEn: 'Adjustment',
      paymentStatusEn: 'Unpaid',
      orderFullPrice: 55,
      amountBeforePayment: 55,
      extend: false
    }
  ];
  const fakePoints = 111;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLangObs']);
  languageServiceMock.getLangValue.and.returnValue('fakeValue');
  languageServiceMock.getCurrentLangObs.and.returnValue(of('ua'));

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrdersListComponent, LocalizedCurrencyPipe, LangValueDirective],
      imports: [
        MatDialogModule,
        UbsSharedModule,
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
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
      expect(isOrderPaymentAccessRes).toBeTruthy();
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

    it('if order is unpaid and formed should open editOrPayPopup', () => {
      const orderMock = {
        id: 18,
        dateForm: 12,
        orderStatusEn: 'Formed',
        paymentStatusEn: 'Unpaid',
        orderFullPrice: 55,
        amountBeforePayment: 55,
        extend: false
      };
      const editOrPayPopupSpy = spyOn(component, 'editOrPayPopup');
      const openOrderPaymentPopUpSpy = spyOn(component as any, 'openOrderPaymentPopUp');
      spyOn(component.orderService, 'cleanOrderState');
      spyOn(component, 'isOrderUnpaid').and.returnValue(true);

      component.openOrderPaymentDialog(orderMock as any);

      expect(openOrderPaymentPopUpSpy).not.toHaveBeenCalled();
      expect(component.isOrderUnpaid(orderMock as any)).toBeTrue();
      expect(editOrPayPopupSpy).toHaveBeenCalled();
      expect(editOrPayPopupSpy).toHaveBeenCalledWith(orderMock as any);
      expect(component.orderService.cleanOrderState).toHaveBeenCalled();
    });

    it('if order is half-paid should open openOrderPaymentPopUp', () => {
      const openOrderPaymentPopUpSpy = spyOn(component as any, 'openOrderPaymentPopUp');
      const editOrPayPopupSpy = spyOn(component, 'editOrPayPopup');
      spyOn(component.orderService, 'cleanOrderState');
      spyOn(component, 'isOrderUnpaid').and.returnValue(false);

      component.openOrderPaymentDialog(fakeIputOrderData[1] as any);

      expect(component.isOrderUnpaid(fakeIputOrderData[1] as any)).toBeFalse();
      expect(editOrPayPopupSpy).not.toHaveBeenCalled();
      expect(openOrderPaymentPopUpSpy).toHaveBeenCalled();
      expect(openOrderPaymentPopUpSpy).toHaveBeenCalledWith(fakeIputOrderData[1] as any);
      expect(component.orderService.cleanOrderState).toHaveBeenCalled();
    });

    it('if order is unpaid and not formed should open openOrderPaymentPopUp', () => {
      const openOrderPaymentPopUpSpy = spyOn(component as any, 'openOrderPaymentPopUp');
      const editOrPayPopupSpy = spyOn(component, 'editOrPayPopup');
      spyOn(component.orderService, 'cleanOrderState');
      spyOn(component, 'isOrderUnpaid').and.returnValue(true);

      component.openOrderPaymentDialog(fakeIputOrderData[0] as any);

      expect(editOrPayPopupSpy).not.toHaveBeenCalled();
      expect(openOrderPaymentPopUpSpy).toHaveBeenCalled();
      expect(openOrderPaymentPopUpSpy).toHaveBeenCalledWith(fakeIputOrderData[0] as any);
      expect(component.orderService.cleanOrderState).toHaveBeenCalled();
    });

    it('should cover both branches of the ternary operator', () => {
      const formedUnpaidOrder = {
        id: 1,
        orderStatusEn: 'Formed',
        paymentStatusEn: 'Unpaid'
      };

      spyOn(component, 'isOrderUnpaid').and.returnValue(true);
      const editOrPayPopupSpy = spyOn(component, 'editOrPayPopup');
      const openOrderPaymentPopUpSpy = spyOn(component as any, 'openOrderPaymentPopUp');
      spyOn(component.orderService, 'cleanOrderState');

      component.openOrderPaymentDialog(formedUnpaidOrder as any);

      expect(editOrPayPopupSpy).toHaveBeenCalled();
      expect(openOrderPaymentPopUpSpy).not.toHaveBeenCalled();

      editOrPayPopupSpy.calls.reset();
      openOrderPaymentPopUpSpy.calls.reset();

      const otherOrder = {
        id: 2,
        orderStatusEn: 'Done',
        paymentStatusEn: 'Paid'
      };

      (component.isOrderUnpaid as jasmine.Spy).and.returnValue(false);

      component.openOrderPaymentDialog(otherOrder as any);

      expect(openOrderPaymentPopUpSpy).toHaveBeenCalled();
      expect(editOrPayPopupSpy).not.toHaveBeenCalled();
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
          orderStatusEn: 'Formed',
          paymentStatusEn: 'Half paid',
          orderFullPrice: 0,
          amountBeforePayment: 55,
          extend: false
        },
        {
          id: 3,
          dateForm: 55,
          orderStatusEn: 'Done',
          paymentStatusEn: 'Unpaid',
          orderFullPrice: 55,
          amountBeforePayment: 55,
          extend: true
        },
        {
          id: 12,
          dateForm: 15,
          orderStatusEn: 'Adjustment',
          paymentStatusEn: 'Unpaid',
          orderFullPrice: 55,
          amountBeforePayment: 55,
          extend: false
        },
        {
          id: 1,
          dateForm: 11,
          orderStatusEn: 'Canceled',
          paymentStatusEn: 'Paid',
          orderFullPrice: -55,
          amountBeforePayment: 55,
          extend: false
        }
      ];
      component.sortingOrdersByData();
      expect(component.orders).toEqual(resultOrderData as any);
    });
  });

  describe('editOrPayPopup', () => {
    it('should open editOrPayPopup with editOrPayDialogData', () => {
      matDialogMock.open.and.returnValue({
        afterClosed: () => of(true),
        close: () => {}
      });

      component.editOrPayPopup(fakeIputOrderData[1] as any);

      expect(component.editOrPayDialogData).toBeDefined();

      expect(component.editOrPayDialogData.popupTitle).toBe('ubs-client-profile.payment.edit-or-payment');
      expect(component.editOrPayDialogData.popupConfirm).toBe('ubs-client-profile.payment.btn.pay');
      expect(component.editOrPayDialogData.popupCancel).toBe('add-payment.edit');
      expect(component.editOrPayDialogData.isEditOrPayPopup).toBeTrue();

      expect(matDialogMock.open).toHaveBeenCalledWith(
        DialogPopUpComponent,
        jasmine.objectContaining({
          data: component.editOrPayDialogData,
          closeOnNavigation: true,
          disableClose: true,
          hasBackdrop: true,
          panelClass: ''
        })
      );
    });

    it('should call openOrderPaymentPopUp if the dialog returned true', () => {
      matDialogMock.open.and.returnValue({
        afterClosed: () => of(true),
        close: () => {}
      });
      const orderPaymentPopupSpy = spyOn(component as any, 'openOrderPaymentPopUp');

      component.editOrPayPopup(fakeIputOrderData[1] as any);

      expect(orderPaymentPopupSpy).toHaveBeenCalled();
      expect(orderPaymentPopupSpy).toHaveBeenCalledWith(fakeIputOrderData[1] as any);
    });

    it('should call getDataForLocalStorage if the dialog returned false', () => {
      matDialogMock.open.and.returnValue({
        afterClosed: () => of(false),
        close: () => {}
      });
      const getDataForLocalStorageSpy = spyOn(component, 'getDataForLocalStorage');

      component.editOrPayPopup(fakeIputOrderData[1] as any);

      expect(getDataForLocalStorageSpy).toHaveBeenCalled();
      expect(getDataForLocalStorageSpy).toHaveBeenCalledWith(fakeIputOrderData[1] as any);
    });

    it('shouldnt call any method if the dialog was closed and returned undefined', () => {
      matDialogMock.open.and.returnValue({
        afterClosed: () => of(undefined),
        close: () => {}
      });
      const orderPaymentPopupSpy = spyOn(component as any, 'openOrderPaymentPopUp');
      const getDataForLocalStorageSpy = spyOn(component, 'getDataForLocalStorage');

      component.editOrPayPopup(fakeIputOrderData[1] as any);

      expect(orderPaymentPopupSpy).not.toHaveBeenCalled();
      expect(getDataForLocalStorageSpy).not.toHaveBeenCalled();
    });
  });
});
