import { OrderService } from '../../services/order.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { UBSSubmitOrderComponent } from './ubs-submit-order.component';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { orderDetailsMock, personalMockData } from 'src/app/ubs/mocks/order-data-mock';
import { Store } from '@ngrx/store';
import { orderDetailsSelector, orderSelectors, personalDataSelector } from 'src/app/store/selectors/order.selectors';
import { WarningPopUpComponent } from 'src/app/greencity/shared/components';
import { HttpErrorResponse } from '@angular/common/http';
import { PhoneNumberTreatPipe } from '@ubs/shared/pipes/phone-number-treat/phone-number-treat.pipe';

describe('UBSSubmitOrderComponent', () => {
  let component: UBSSubmitOrderComponent;
  let fixture: ComponentFixture<UBSSubmitOrderComponent>;
  let store: jasmine.SpyObj<Store>;
  let orderService: jasmine.SpyObj<OrderService>;
  let ubsOrderFormServiceSpy: jasmine.SpyObj<UBSOrderFormService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['pipe']);
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['processExistingOrder', 'processNewOrder', 'cancelExistingPayment']);
    orderServiceSpy.cancelExistingPayment.and.returnValue(of(true));
    ubsOrderFormServiceSpy = jasmine.createSpyObj('UBSOrderFormService', [
      'transferOrderId',
      'setOrderResponseErrorStatus',
      'setOrderStatus'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['setUbsPaymentOrderId', 'setUserPagePayment']);
    const langServiceSpy = jasmine.createSpyObj('LanguageService', ['getLangValue']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);

    storeSpy.pipe.and.callFake((selector: any) => {
      if (selector === orderSelectors) {
        return of({
          certificateUsed: 10,
          pointsUsed: 5,
          orderSum: 100,
          addressId: 123,
          locationId: 456,
          firstFormValid: true
        });
      } else if (selector === orderDetailsSelector) {
        return of(orderDetailsMock);
      } else if (selector === personalDataSelector) {
        return of(personalMockData);
      }
      return of(null);
    });

    await TestBed.configureTestingModule({
      declarations: [UBSSubmitOrderComponent, PhoneNumberTreatPipe],
      imports: [RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: Store, useValue: storeSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: UBSOrderFormService, useValue: {} },
        { provide: ActivatedRoute, useValue: { queryParams: of({ existingOrderId: 1 }) } },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: LanguageService, useValue: langServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: spyRouter },
        { provide: UBSOrderFormService, useValue: ubsOrderFormServiceSpy },
        PhoneNumberTreatPipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UBSSubmitOrderComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with query params', () => {
    expect(component.existingOrderId).toBe(1);
  });

  it('should open confirmation dialog and call processOrder on confirmation', () => {
    const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialogRef.afterClosed.and.returnValue(of(true));
    dialog.open.and.returnValue(matDialogRef);
    spyOn(component, 'processOrder');
    component.onCancel();

    expect(dialog.open).toHaveBeenCalledWith(WarningPopUpComponent, jasmine.any(Object));
    expect(component.processOrder).toHaveBeenCalledWith(false);
  });

  it('should process existing order successfully', () => {
    orderService.processExistingOrder.and.returnValue(of({ orderId: 123, link: 'https://' }));
    component.existingOrderId = 1;
    component.personalData = personalMockData;
    component.orderDetails = orderDetailsMock;
    component.processOrder(true);

    expect(component.isLoadingAnim).toBe(true);
    expect(orderService.processExistingOrder).toHaveBeenCalled();
  });

  it('should handle error and redirect on failure', () => {
    orderService.processExistingOrder.and.returnValue(throwError(() => new Error('Failed')));
    component.existingOrderId = 1;
    component.personalData = personalMockData;
    component.orderDetails = orderDetailsMock;
    component.processOrder(true);

    expect(component.isLoadingAnim).toBe(false);
  });

  it('should handle error from processExistingOrder', () => {
    const errorResponse = new HttpErrorResponse({
      error: { code: 'some code', message: 'some message' },
      status: 404
    });

    if (!router.navigate.calls) {
      spyOn(router, 'navigate');
    }

    orderService.processExistingOrder.and.returnValue(throwError(() => errorResponse));
    component.existingOrderId = 1;
    component.orderDetails = orderDetailsMock;
    component.processOrder();
    fixture.detectChanges();

    expect(component.isLoadingAnim).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['ubs', 'confirm']);
  });

  it('processPointsPayment should call ubsOrderFormService methods', () => {
    const orderIdMock = 1;

    (component as any).processPointsPayment(orderIdMock);

    expect(ubsOrderFormServiceSpy.transferOrderId).toHaveBeenCalled();
    expect(ubsOrderFormServiceSpy.transferOrderId).toHaveBeenCalledWith(orderIdMock);
    expect(ubsOrderFormServiceSpy.setOrderResponseErrorStatus).toHaveBeenCalled();
    expect(ubsOrderFormServiceSpy.setOrderResponseErrorStatus).toHaveBeenCalledWith(false);
    expect(ubsOrderFormServiceSpy.setOrderStatus).toHaveBeenCalled();
    expect(ubsOrderFormServiceSpy.setOrderStatus).toHaveBeenCalledWith(true);
  });

  it('processPointsPayment should call localStorageService methods', () => {
    const orderIdMock = 2;

    (component as any).processPointsPayment(orderIdMock);

    expect(localStorageServiceSpy.setUserPagePayment).toHaveBeenCalled();
    expect(localStorageServiceSpy.setUserPagePayment).toHaveBeenCalledWith(true);
    expect(localStorageServiceSpy.setUbsPaymentOrderId).toHaveBeenCalled();
    expect(localStorageServiceSpy.setUbsPaymentOrderId).toHaveBeenCalledWith(orderIdMock);
  });

  it('processPayment should call processPointsPayment if points cover the sum', () => {
    const processPointsPaymentSpy = spyOn(component as any, 'processPointsPayment');
    component.finalSum = 0;
    component.pointsUsed = 540;
    const orderResponseMock = {
      orderId: 1,
      link: null
    };
    (component as any).processPayment(orderResponseMock);

    expect(processPointsPaymentSpy).toHaveBeenCalled();
    expect(processPointsPaymentSpy).toHaveBeenCalledWith(orderResponseMock.orderId);
  });

  it('processPayment should not call processPointsPayment if no points are used', () => {
    const processPointsPaymentSpy = spyOn(component as any, 'processPointsPayment');
    component.finalSum = 540;
    component.pointsUsed = 0;
    component.isShouldBePaid = true;
    const orderResponseMock = {
      orderId: 1,
      link: null
    };
    (component as any).processPayment(orderResponseMock);

    expect(processPointsPaymentSpy).not.toHaveBeenCalled();
  });

  it('processPayment should not call processPointsPayment if points dont cover the sum', () => {
    const processPointsPaymentSpy = spyOn(component as any, 'processPointsPayment');
    component.finalSum = 540;
    component.pointsUsed = 150;
    component.isShouldBePaid = true;
    const orderResponseMock = {
      orderId: 1,
      link: null
    };
    (component as any).processPayment(orderResponseMock);

    expect(processPointsPaymentSpy).not.toHaveBeenCalled();
  });
});
