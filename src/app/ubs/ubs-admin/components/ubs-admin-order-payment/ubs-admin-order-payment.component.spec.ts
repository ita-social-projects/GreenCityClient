import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { IEmployee, IOrderInfo, IPaymentInfoDto } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';

import { UbsAdminOrderPaymentComponent } from './ubs-admin-order-payment.component';

describe('UbsAdminOrderPaymentComponent', () => {
  let component: UbsAdminOrderPaymentComponent;
  let fixture: ComponentFixture<UbsAdminOrderPaymentComponent>;
  const matDialogMock = () => ({
    open: () => ({
      afterClosed: () => ({ pipe: () => ({ subscribe: (f) => f({}) }) })
    })
  });

  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOverpaymentMsg']);
  orderServiceMock.getOverpaymentMsg.and.returnValue('fakeMessage');

  const fakeAmountOfBagsConfirmed: Map<string, number> = new Map();
  fakeAmountOfBagsConfirmed.set('1', 1);
  fakeAmountOfBagsConfirmed.set('2', 2);
  fakeAmountOfBagsConfirmed.set('3', 1);

  const fakeAllPositionsEmployees: Map<string, IEmployee[]> = new Map();
  fakeAllPositionsEmployees.set('PositionDto(id=1, name=Менеджер послуги)', [{ id: 1, name: 'Maria Admin' }]);
  fakeAllPositionsEmployees.set('PositionDto(id=2, name=Менеджер обдзвону)', []);
  fakeAllPositionsEmployees.set('PositionDto(id=3, name=Логіст)', []);
  fakeAllPositionsEmployees.set('PositionDto(id=4, name=Штурман)', []);
  fakeAllPositionsEmployees.set('PositionDto(id=5, name=Водій)', []);

  const fakeOrderInfo: IOrderInfo = {
    generalOrderInfo: {
      id: 23,
      dateFormed: '2022-02-08T15:21:44.85458',
      adminComment: null,
      orderStatus: 'FORMED',
      orderStatusName: 'Сформовано',
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
          translation: 'Підтвердженно'
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
      orderPaymentStatus: 'UNPAID',
      orderPaymentStatusName: 'Не оплачено',
      orderPaymentStatusesDto: [
        {
          key: 'PAID',
          translation: 'Оплачено'
        },
        {
          key: 'UNPAID',
          translation: 'Не оплачено'
        },
        {
          key: 'HALF_PAID',
          translation: 'Частково оплачено'
        },
        {
          key: 'PAYMENT_REFUNDED',
          translation: 'Оплату повернуто'
        }
      ]
    },
    userInfoDto: {
      recipientId: 37,
      customerEmail: 'greencitytest@gmail.com',
      customerName: 'test',
      customerPhoneNumber: '380964521167',
      customerSurName: 'test',
      recipientEmail: 'test@gmail.com',
      recipientName: 'test',
      recipientPhoneNumber: '380964523467',
      recipientSurName: 'test',
      totalUserViolations: 0,
      userViolationForCurrentOrder: 0
    },
    addressExportDetailsDto: {
      addressId: 32,
      addressCity: 'Київ',
      addressDistrict: 'Шевченківський',
      addressEntranceNumber: 1,
      addressHouseCorpus: 3,
      addressHouseNumber: 42,
      addressRegion: 'Київська область',
      addressStreet: 'Січових Стрільців вул'
    },
    addressComment: '',
    amountOfBagsConfirmed: fakeAmountOfBagsConfirmed,
    amountOfBagsExported: new Map(),
    amountOfBagsOrdered: fakeAmountOfBagsConfirmed,
    bags: [
      {
        actual: 0,
        capacity: 120,
        confirmed: 1,
        id: 1,
        name: 'Безпечні відходи',
        planned: 1,
        price: 250
      },
      {
        actual: 0,
        capacity: 120,
        confirmed: 2,
        id: 2,
        name: 'Текстильні відходи',
        planned: 2,
        price: 300
      },
      {
        actual: 0,
        capacity: 20,
        confirmed: 1,
        id: 3,
        name: 'Текстильні відходи',
        planned: 1,
        price: 50
      }
    ],
    courierPricePerPackage: 65,
    courierInfo: {
      courierLimit: 'LIMIT_BY_AMOUNT_OF_BAG',
      maxAmountOfBigBags: 99,
      maxPriceOfOrder: 500000,
      minAmountOfBigBags: 2,
      minPriceOfOrder: 500
    },
    orderBonusDiscount: 0,
    orderCertificateTotalDiscount: 0,
    orderDiscountedPrice: 900,
    orderExportedDiscountedPrice: 0,
    orderExportedPrice: 0,
    orderFullPrice: 900,
    certificates: [],
    numbersFromShop: [],
    comment: '',
    paymentTableInfoDto: {
      overpayment: 0,
      paidAmount: 0,
      paymentInfoDtos: [
        {
          amount: 200,
          comment: null,
          id: 40,
          imagePath: null,
          paymentId: '436436436',
          receiptLink: '',
          settlementdate: '2022-02-01',
          currentDate: '2022-02-09'
        },
        {
          amount: 100,
          comment: null,
          id: 44,
          imagePath: null,
          paymentId: '435643643',
          receiptLink: '',
          settlementdate: '2022-02-01',
          currentDate: '2022-02-09'
        },
        {
          amount: 350,
          comment: null,
          id: 45,
          imagePath: null,
          paymentId: '3253532',
          receiptLink: '',
          settlementdate: '2022-02-04',
          currentDate: '2022-02-09'
        }
      ],
      unPaidAmount: 900
    },
    exportDetailsDto: {
      allReceivingStations: ['Саперно-Слобідська'],
      dateExport: null,
      receivingStation: null,
      timeDeliveryFrom: null,
      timeDeliveryTo: null
    },
    employeePositionDtoRequest: {
      allPositionsEmployees: fakeAllPositionsEmployees,
      currentPositionEmployees: new Map(),
      orderId: 23
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderPaymentComponent, LocalizedCurrencyPipe],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialog, useFactory: matDialogMock },
        { provide: OrderService, useValue: orderServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderPaymentComponent);
    component = fixture.componentInstance;
    component.orderInfo = fakeOrderInfo;
    component.paymentsArray = fakeOrderInfo.paymentTableInfoDto.paymentInfoDtos;
    component.pageOpen = false;
    component.overpayment = 450;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('life cycle hook ngOnInit', () => {
    component.ngOnInit();
    expect(component.orderId).toBe(23);
    expect(component.paymentInfo).toBe(fakeOrderInfo.paymentTableInfoDto);
    expect(component.paymentsArray).toBe(fakeOrderInfo.paymentTableInfoDto.paymentInfoDtos);
    expect(component.paymentInfo).toBe(fakeOrderInfo.paymentTableInfoDto);
    expect(component.paidAmount).toBe(component.paymentInfo.paidAmount);
    expect(component.unPaidAmount).toBe(component.paymentInfo.unPaidAmount);
  });

  it('life cycle hook ngOnChanges', () => {
    const previousValue = component.overpayment;
    const currentValue = component.overpayment + 150;

    const changesObj: SimpleChanges = {
      name: new SimpleChange(previousValue, currentValue, true)
    };

    component.ngOnChanges(changesObj);
  });

  it('method formatDate', () => {
    expect(component.formatDate('2020-07-02')).toBe('02.07.2020');
  });

  it('method setDateInPaymentArray', () => {
    const fakePaymentsArray: IPaymentInfoDto[] = component.paymentsArray;
    const fakeSettlementdateArray: string[] = [];

    for (const fakePayment of fakePaymentsArray) {
      fakeSettlementdateArray.push(fakePayment.settlementdate);
    }

    component.setDateInPaymentArray(component.paymentsArray);

    for (let i = 0; i < component.paymentsArray.length && i < fakeSettlementdateArray.length; i++) {
      expect(component.paymentsArray[i].settlementdate).toBe(component.formatDate(fakeSettlementdateArray[i]));
    }
  });

  it('method openDetails', () => {
    component.openDetails();
    expect(component.pageOpen).toBeTruthy();
  });

  it('method setOverpayment', () => {
    const fakeModuleOverPayment = Math.abs(component.overpayment);
    component.setOverpayment(component.overpayment);

    expect(orderServiceMock.getOverpaymentMsg).toHaveBeenCalledWith(component.overpayment);
    expect(component.overpayment).toBe(fakeModuleOverPayment);
  });
});
