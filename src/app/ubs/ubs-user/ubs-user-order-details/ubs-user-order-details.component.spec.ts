import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsUserOrderDetailsComponent } from './ubs-user-order-details.component';
import { IUserOrderInfo } from '../ubs-user-orders-list/models/UserOrder.interface';

describe('UbsUserOrderDetailsComponent', () => {
  let component: UbsUserOrderDetailsComponent;
  let fixture: ComponentFixture<UbsUserOrderDetailsComponent>;

  const fakeIputOrderData = {
    additionalOrders: [],
    address: {
      addressCity: 'Lviv',
      addressComment: 'qweqe223',
      addressDistinct: 'Darnitsk',
      addressRegion: 'Lviv region',
      addressStreet: 'King Danylo'
    },
    amountBeforePayment: 1100,
    bags: [
      {
        capacity: 120,
        count: 2,
        price: 250,
        service: 'Safe',
        totalPrice: 500
      }
    ],
    bonuses: 0,
    certificate: [
      { certificateStatus: 'USED', points: 10, creationDate: '2022-05-09', code: '9953-7741' },
      { certificateStatus: 'USED', points: 500, creationDate: '2022-04-15', code: '3003-1992' }
    ],
    dateForm: '2022-03-24T23:48:21.689274',
    datePaid: '2022-03-24T23:48:21.689274',
    extend: true,
    id: 1,
    orderComment: '',
    orderFullPrice: 1100,
    orderStatus: 'Adjustment',
    paidAmount: 1100,
    paymentStatus: 'Paid',
    sender: {
      senderEmail: 'm.kovalushun@gmail.com',
      senderName: 'mukola',
      senderPhone: '+380977777777',
      senderSurname: 'Kovalushun'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrderDetailsComponent, LocalizedCurrencyPipe],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserOrderDetailsComponent);
    component = fixture.componentInstance;
    component.order = JSON.parse(JSON.stringify(fakeIputOrderData)) as IUserOrderInfo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should calcuate certificatesAmount', () => {
    component.ngOnInit();
    expect(component.certificatesAmount).toBe(510);
  });

  describe('isOrderPaid', () => {
    it('order  is paid', () => {
      fakeIputOrderData.paymentStatus = 'Paid';
      const isOrderPaidRes = component.isPaid(fakeIputOrderData as IUserOrderInfo);
      expect(isOrderPaidRes).toBeTruthy();
    });

    it('order is not unpaid', () => {
      fakeIputOrderData.paymentStatus = 'Unpaid';
      const isOrderPaidRes = component.isPaid(fakeIputOrderData as IUserOrderInfo);
      expect(isOrderPaidRes).toBeFalsy();
    });
  });

  it(' should return ua Value by getLangValue', () => {
    component.currentLanguage = 'ua';
    const value = component.getLangValue('uaValue', 'enValue');
    expect(value).toBe('uaValue');
  });

  it(' should return en Value by getLangValue', () => {
    component.currentLanguage = 'en';
    const value = component.getLangValue('uaValue', 'enValue');
    expect(value).toBe('enValue');
  });
});
