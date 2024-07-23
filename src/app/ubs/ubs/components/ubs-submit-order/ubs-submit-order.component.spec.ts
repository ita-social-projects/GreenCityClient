import { OrderService } from '../../services/order.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { UBSSubmitOrderComponent } from './ubs-submit-order.component';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { orderDetailsMock, personalMockData } from 'src/app/ubs/mocks/order-data-mock';
import { Store } from '@ngrx/store';
import { orderDetailsSelector, orderSelectors, personalDataSelector } from '../../../../store/selectors/order.selectors';
import { WarningPopUpComponent } from '@shared/components';
import { HttpErrorResponse } from '@angular/common/http';

describe('UBSSubmitOrderComponent', () => {
  let component: UBSSubmitOrderComponent;
  let fixture: ComponentFixture<UBSSubmitOrderComponent>;
  let store: jasmine.SpyObj<Store>;
  let orderService: jasmine.SpyObj<OrderService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['pipe']);
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['processExistingOrder', 'processNewOrder']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['setUbsPaymentOrderId']);
    const langServiceSpy = jasmine.createSpyObj('LanguageService', ['getLangValue']);

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
      declarations: [UBSSubmitOrderComponent],
      imports: [RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: Store, useValue: storeSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: UBSOrderFormService, useValue: {} },
        { provide: ActivatedRoute, useValue: { queryParams: of({ existingOrderId: 1 }) } },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: LanguageService, useValue: langServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UBSSubmitOrderComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error from subscription should set loadingAnim to false', () => {
    const errorResponse = new HttpErrorResponse({
      error: { code: 'some code', message: 'some message' },
      status: 404
    });

    spyOn(orderService, 'processExistingOrder').and.returnValue(throwError(() => errorResponse));
    component.existingOrderId = 1;
    component.processOrder(true);

    fixture.whenStable().then(() => {
      expect(component.isLoadingAnim).toBeFalse();
    });
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

  it('should redirect to main page on cancellation', () => {
    const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialogRef.afterClosed.and.returnValue(of(false));
    dialog.open.and.returnValue(matDialogRef);
    spyOn(component as any, 'redirectToMainPage');
    component.onCancel();

    expect((component as any).redirectToMainPage).toHaveBeenCalled();
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
    spyOn(component as any, 'redirectToConfirmPage');
    component.existingOrderId = 1;
    component.personalData = personalMockData;
    component.orderDetails = orderDetailsMock;
    component.processOrder(true);

    expect(component.isLoadingAnim).toBe(false);
    expect((component as any).redirectToConfirmPage).toHaveBeenCalled();
  });

  it('should initialize listeners correctly', () => {
    spyOn(component, 'initListeners').and.callThrough();
    component.ngOnInit();

    expect(component.initListeners).toHaveBeenCalled();
    expect(store.pipe).toHaveBeenCalledWith(orderSelectors);
    expect(store.pipe).toHaveBeenCalledWith(orderDetailsSelector);
    expect(store.pipe).toHaveBeenCalledWith(personalDataSelector);
    expect(component.certificateUsed).toBe(10);
    expect(component.pointsUsed).toBe(5);
    expect(component.orderSum).toBe(100);
    expect(component.addressId).toBe(123);
    expect(component.locationId).toBe(456);
    expect(component.isFirstFormValid).toBe(true);
    expect(component.orderDetails).toEqual(orderDetailsMock);
    expect(component.bags).toEqual(orderDetailsMock.bags.filter((bag) => bag.quantity));
    expect(component.additionalOrders).toEqual(orderDetailsMock.additionalOrders);
    expect(component.personalData).toEqual(personalMockData);
  });
});
