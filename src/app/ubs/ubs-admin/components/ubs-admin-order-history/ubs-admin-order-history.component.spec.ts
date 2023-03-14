import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderHistoryComponent } from './ubs-admin-order-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IOrderInfo, IEmployee } from '../../models/ubs-admin.interface';
import { AddOrderCancellationReasonComponent } from '../add-order-cancellation-reason/add-order-cancellation-reason.component';

describe('UbsAdminOrderHistoryComponent', () => {
  let component: UbsAdminOrderHistoryComponent;
  let fixture: ComponentFixture<UbsAdminOrderHistoryComponent>;
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOrderHistory']);
  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const fakeAllPositionsEmployees: Map<string, IEmployee[]> = new Map();

  const OrderInfoMock: IOrderInfo = {
    generalOrderInfo: {
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
      addressCityEng: 'Kyiv',
      addressDistrict: 'Шевченківський',
      addressDistrictEng: 'Shevchenkivskyi',
      addressEntranceNumber: 1,
      addressHouseCorpus: 3,
      addressHouseNumber: 42,
      addressRegion: 'Київська область',
      addressRegionEng: 'Kyiv Oblast',
      addressStreet: 'Січових Стрільців вул',
      addressStreetEng: 'Sichovyh Streltsyv str'
    },
    addressComment: '',
    amountOfBagsConfirmed: new Map(),
    amountOfBagsExported: new Map(),
    amountOfBagsOrdered: new Map(),
    bags: [
      {
        actual: 0,
        capacity: 120,
        confirmed: 1,
        id: 1,
        name: 'Безпечні відходи',
        planned: 1,
        price: 250
      }
    ],
    courierPricePerPackage: 1,
    courierInfo: {
      courierLimit: 'LIMIT_BY_AMOUNT_OF_BAG',
      min: 2,
      max: 99
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
      orderId: 1
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, NoopAnimationsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [UbsAdminOrderHistoryComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
        { provide: MatDialog, useValue: matDialogMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOrderHistory when orderInfo changes', () => {
    const spy = spyOn(component, 'getOrderHistory');
    component.orderInfo = OrderInfoMock;

    const changes = {
      orderInfo: {
        currentValue: true,
        firstChange: true,
        isFirstChange: () => true,
        previousValue: undefined
      }
    };
    component.ngOnChanges(changes);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should not call getOrderHistory when orderInfo does not change', () => {
    const spy = spyOn(component, 'getOrderHistory');
    component.orderInfo = OrderInfoMock;
    const changes = {};
    component.ngOnChanges(changes);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should set pageOpen to true when initially false', () => {
    component.pageOpen = false;
    component.openDetails();

    expect(component.pageOpen).toBe(true);
  });

  it('should set pageOpen to false when initially true', () => {
    component.pageOpen = true;
    component.openDetails();

    expect(component.pageOpen).toBe(false);
  });
  it('showPopup should call cancellationReason', () => {
    spyOn(component, 'cancellationReason');
  });
  it('cancellationReason  dialog.open should been called', () => {
    spyOn(component, 'showPopup');
    component.cancellationReason();
    expect((component as any).dialog.open).toHaveBeenCalledWith(AddOrderCancellationReasonComponent, {
      hasBackdrop: true
    });
  });
});
