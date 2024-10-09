import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';
import { UbsAdminOrderDetailsFormComponent } from './ubs-admin-order-details-form.component';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { OrderInfoMockedData } from './../../services/orderInfoMock';

describe('UbsAdminOrderDetailsFormComponent', () => {
  let component: UbsAdminOrderDetailsFormComponent;
  let fixture: ComponentFixture<UbsAdminOrderDetailsFormComponent>;
  const orderStatusMock = {
    key: OrderStatus.FORMED,
    ableActualChange: false
  };
  const fakeOrderInfo = OrderInfoMockedData;
  const bagsInfoMock = {
    amount: {
      planned: 11,
      confirmed: 19,
      actual: 27
    },
    sum: {
      planned: 105,
      confirmed: 190,
      actual: 275
    },
    finalSum: {
      planned: 60,
      confirmed: 120,
      actual: 180
    },
    bonuses: 20,
    certificateDiscount: 30
  };

  const orderDetailsMock = {
    bonuses: 100,
    paidAmount: 23,
    certificateDiscount: 50,
    bags: [
      { planned: 2, confirmed: 3, actual: 4, price: 10 },
      { planned: 1, confirmed: 2, actual: 3, price: 20 },
      { planned: 3, confirmed: 4, actual: 5, price: 5 }
    ],
    courierInfo: {},
    courierPricePerPackage: 50
  };

  const orderDetailsFormMock = new FormGroup({
    storeOrderNumbers: new FormControl([777]),
    certificates: new FormControl(''),
    customerComment: new FormControl(''),
    orderFullPrice: new FormControl(9999)
  });

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => valUa;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderDetailsFormComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: [] },
        { provide: LanguageService, useValue: languageServiceMock },
        OrderService,
        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderDetailsFormComponent);
    component = fixture.componentInstance;
    component.orderStatusInfo = orderStatusMock;
    component.orderDetailsForm = orderDetailsFormMock;
    component.orderDetails = JSON.parse(JSON.stringify(orderDetailsMock));
    component.bagsInfo = JSON.parse(JSON.stringify(bagsInfoMock));
    component.orderInfo = JSON.parse(JSON.stringify(fakeOrderInfo));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lifecycle hook ngOnInit', () => {
    component.totalPaid = 300;
    component.orderInfo.generalOrderInfo.orderPaymentStatus = 'PAID';
    component.ngOnInit();
    expect(component.isVisible).toBe(component.orderStatusInfo.ableActualChange);
    expect(component.isOrderPaid).toBeTruthy();
    expect(component.orderDetailsForm.get('certificates').disable()).toBe(undefined);
  });

  it('should return true when the order is brought by himself and paid', () => {
    component.isOrderBroughtByHimself = true;
    component.isOrderPaid = true;

    expect(component.showWriteOffStationField()).toBeTruthy();
  });

  it('should return false when the order is not brought by himself', () => {
    component.isOrderBroughtByHimself = false;
    component.isOrderPaid = true;

    expect(component.showWriteOffStationField()).toBeFalsy();
  });

  xit('should return false when the order is brought by himself but not paid, and no bonuses or certificate are used', () => {
    component.isOrderBroughtByHimself = true;
    component.isOrderPaid = false;
    component.orderDetails.bonuses = 0;
    component.orderDetails.certificateDiscount = 0;

    expect(component.showWriteOffStationField()).toBeFalsy();
  });

  it('should toggle the value of pageOpen property', () => {
    component.pageOpen = false;
    component.openDetails();
    expect(component.pageOpen).toBe(true);

    component.openDetails();
    expect(component.pageOpen).toBe(false);
  });

  describe('getOrderBonusValue', () => {
    it('should return 0 if the order is cancelled', () => {
      component.isOrderCancelled = true;
      expect(component.getOrderBonusValue(100)).toEqual(0);
    });

    it('should return negative bonuses if the order is not cancelled and bonuses are present', () => {
      component.isOrderCancelled = false;
      expect(component.getOrderBonusValue(100)).toEqual('-100');
    });

    it('should return empty string if the order is not cancelled and bonuses are not present', () => {
      component.isOrderCancelled = false;
      expect(component.getOrderBonusValue(null)).toEqual('');
    });
  });
});
