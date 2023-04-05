import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderHistoryComponent } from './ubs-admin-order-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IOrderInfo, IEmployee, INotTakenOutReason } from '../../models/ubs-admin.interface';
import { of, Subject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { AddOrderNotTakenOutReasonComponent } from '../add-order-not-taken-out-reason/add-order-not-taken-out-reason.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('UbsAdminOrderHistoryComponent', () => {
  let component: UbsAdminOrderHistoryComponent;
  let fixture: ComponentFixture<UbsAdminOrderHistoryComponent>;
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOrderHistory']);
  const MatDialogRefMock = { close: () => {} };
  const fakeAllPositionsEmployees: Map<string, IEmployee[]> = new Map();

  const orderNotTakenOutReasonMock: INotTakenOutReason = {
    description: 'string',
    images: ['string']
  };

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

  const dialogStub = {
    afterClosed() {
      return of(true);
    }
  };

  const matDialogMock = jasmine.createSpyObj('dialog', ['open']);
  matDialogMock.open.and.returnValue(dialogStub);

  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatDialogModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [UbsAdminOrderHistoryComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: MatDialogRefMock },
        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.createSpyObj('orderService', { getOrderHistory: OrderInfoMock });
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

  it('should call getNotTakenOutReason when orderInfo changes', () => {
    const spy = spyOn(component, 'getNotTakenOutReason');
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

  it('should not call getNotTakenOutReason when orderInfo does not change', () => {
    const spy = spyOn(component, 'getNotTakenOutReason');
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

  it('should call showPopup when user click on special status', () => {
    const spy = spyOn(component, 'showPopup');
    component.showPopup(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should  NOT to call openCancelReason when order history event name isnt "Скасовано"', () => {
    const orderHistoryId = 1;
    const orderHistoryMock = [
      {
        authorName: 'Kateryna',
        eventDate: '2022-09-11',
        eventName: 'На маршуті',
        id: orderHistoryId
      }
    ];
    const spy = spyOn(component, 'openCancelReason');
    component.orderHistory = orderHistoryMock;
    component.showPopup(orderHistoryId);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should  NOT to call openCancelReason when order history id doesn"t match orderHistoryMock', () => {
    const orderHistoryId = 1;
    const orderHistoryMock = [
      {
        authorName: 'Kateryna',
        eventDate: '2022-09-11',
        eventName: 'Скасовано',
        id: 3
      }
    ];
    const spy = spyOn(component, 'openCancelReason');
    component.orderHistory = orderHistoryMock;
    component.showPopup(orderHistoryId);
    expect(spy).not.toHaveBeenCalled();
  });

  it('openDialog should be called', () => {
    const spy = spyOn(MatDialogMock.prototype, 'open');
    MatDialogMock.prototype.open();
    expect(spy).toHaveBeenCalled();
  });

  it('openCancelReason should call dialog.open once', () => {
    const spy = spyOn((component as any).dialog, 'open');
    component.orderInfo = OrderInfoMock;
    component.openCancelReason();
    expect(spy).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy$ = new Subject<boolean>();
    spyOn((component as any).destroy$, 'next');
    component.ngOnDestroy();
    expect((component as any).destroy$.next).toHaveBeenCalledTimes(1);
  });
});
