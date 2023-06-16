import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { IEmployee, IOrderInfo, IPaymentInfoDto } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { Store, StoreModule } from '@ngrx/store';

import { UbsAdminOrderPaymentComponent } from './ubs-admin-order-payment.component';

describe('UbsAdminOrderPaymentComponent', () => {
  let component: UbsAdminOrderPaymentComponent;
  let fixture: ComponentFixture<UbsAdminOrderPaymentComponent>;
  let storeMock;
  const matDialogMock = () => ({
    open: () => ({
      afterClosed: () => ({ pipe: () => ({ subscribe: (f) => f({}) }) })
    })
  });

  const MatDialogRefMock = {
    close: () => {}
  };

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
      orderPaymentStatus: 'UNPAID',
      orderPaymentStatusName: 'Не оплачено',
      orderPaymentStatusNameEng: 'Unpaid',
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
      addressCityEng: 'Київ',
      addressDistrict: 'Шевченківський',
      addressDistrictEng: 'Шевченківський',
      addressEntranceNumber: 1,
      addressHouseCorpus: 3,
      addressHouseNumber: 42,
      addressRegion: 'Київська область',
      addressRegionEng: 'Київська область',
      addressStreet: 'Січових Стрільців вул',
      addressStreetEng: 'Січових Стрільців вул'
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
      max: 99,
      min: 2
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
      overpayment: 480,
      paidAmount: 250,
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
          settlementdate: '2022-08-22',
          currentDate: '2022-02-09'
        },
        {
          amount: -350,
          comment: null,
          id: 45,
          imagePath: null,
          paymentId: '3253532',
          receiptLink: '',
          settlementdate: '2020-02-18',
          currentDate: '2022-02-09'
        }
      ],
      unPaidAmount: 650
    },
    exportDetailsDto: {
      allReceivingStations: [],
      dateExport: null,
      receivingStationId: null,
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
    storeMock = {
      dispatch: jasmine.createSpy('dispatch')
    };

    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderPaymentComponent, LocalizedCurrencyPipe],
      imports: [MatDialogModule, TranslateModule.forRoot(), StoreModule.forRoot({})],
      providers: [
        { provide: MatDialog, useFactory: matDialogMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: MatDialogRef, useValue: MatDialogRefMock },
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
    component.ngOnInit();
    expect(component.orderId).toBe(23);
    expect(component.paymentInfo).toBe(fakeOrderInfo.paymentTableInfoDto);
    expect(component.paymentsArray).toBe(fakeOrderInfo.paymentTableInfoDto.paymentInfoDtos);
    expect(component.paymentInfo).toBe(fakeOrderInfo.paymentTableInfoDto);
    expect(component.paidAmount).toBe(component.paymentInfo.paidAmount);
    expect(component.unPaidAmount).toBe(component.paymentInfo.unPaidAmount);
    expect(component.currentOrderStatus).toBe('Formed');
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
    component.openDetails();
    expect(component.pageOpen).toBeTruthy();
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

  it('method isOverpaymentReturnAvailable', () => {
    expect(component.isOverpaymentReturnAvailable()).toBeFalsy();
    component.currentOrderStatus = 'CANCELED';
    expect(component.isOverpaymentReturnAvailable()).toBeTruthy();
  });

  it('method positivePaymentsArrayAmount', () => {
    component.positivePaymentsArrayAmount();
    component.paymentsArray.forEach((payment: IPaymentInfoDto) => {
      expect(payment.amount).toBeGreaterThan(0);
    });
  });

  it('method postDataItem', () => {
    (component as any).postDataItem(250, 'PAID');

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
});
