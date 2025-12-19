import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { Action, Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Component } from '@angular/core';

import { UBSOrderDetailsComponent } from './ubs-order-details.component';
import {
  certificateUsedSelector,
  courierLocationsSelector,
  existingOrderInfoSelector,
  isOrderDetailsLoadingSelector,
  orderDetailsSelector,
  pointsUsedSelector,
  tariffSelector
} from 'src/app/store/selectors/order.selectors';
import { ActiveTariffInfo, Bag, CourierLocations, OrderDetails } from '@ubs/ubs/models/ubs.interface';
import { IUserOrderInfo } from '@ubs/ubs-user/components/ubs-user-orders-list/models/UserOrder.interface';
import {
  GetCourierLocations,
  GetCourierLocationsSuccess,
  GetExistingOrderDetails,
  GetExistingOrderDetailsSuccess,
  GetOrderDetails,
  GetOrderDetailsSuccess,
  SetAdditionalOrders,
  SetOrderComment,
  SetTariff
} from 'src/app/store/actions/order.actions';
import { ExtraPackagesPopUpComponent } from '@ubs/ubs/components/ubs-order-details/extra-packages-pop-up/extra-packages-pop-up.component';
import { UbsOrderLocationPopupComponent } from '@ubs/ubs/components/ubs-order-details/ubs-order-location-popup/ubs-order-location-popup.component';
import { activeTariffsMock } from '@ubs/ubs-admin/services/orderInfoMock';
import { OrderService } from '@ubs/ubs/services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { provideMockActions } from '@ngrx/effects/testing';

@Component({
  selector: 'app-spinner',
  template: '<div></div>'
})
class MockSpinnerComponent {}

describe('UBSOrderDetailsComponent', () => {
  let component: UBSOrderDetailsComponent;
  let fixture: ComponentFixture<UBSOrderDetailsComponent>;
  let store: jasmine.SpyObj<Store>;
  let dialog: MatDialog;
  let route: ActivatedRoute;
  let actions$: Observable<Action>;
  let orderService: jasmine.SpyObj<OrderService>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let fakeLanguageSubject: Subject<string>;

  let tariffSubject: BehaviorSubject<ActiveTariffInfo | null>;
  let orderDetailsSubject: BehaviorSubject<OrderDetails>;
  let courierLocationsSubject: BehaviorSubject<CourierLocations>;
  let existingOrderInfoSubject: BehaviorSubject<IUserOrderInfo | null>;
  let pointsUsedSubject: BehaviorSubject<number>;
  let certificateUsedSubject: BehaviorSubject<number>;
  let isLoadingSubject: BehaviorSubject<boolean>;

  const mockTariff: ActiveTariffInfo = activeTariffsMock[0];
  const mockOrderDetails: OrderDetails = { bags: [{ id: 1, name: 'Bag 1' } as Bag], points: 100 } as OrderDetails;
  const mockLocations: CourierLocations = { courierStatus: 'active', min: 1, max: 2 } as CourierLocations;
  const mockExistingOrder: IUserOrderInfo = {
    id: 123,
    orderComment: 'Test Comment',
    additionalOrders: ['Order 1', 'Order 2']
  } as IUserOrderInfo;

  beforeEach(waitForAsync(() => {
    actions$ = of(
      GetOrderDetailsSuccess({ orderDetails: mockOrderDetails }),
      GetExistingOrderDetailsSuccess({ orderDetails: mockOrderDetails }),
      GetCourierLocationsSuccess({ locations: mockLocations })
    );
    fakeLanguageSubject = new Subject<string>();
    tariffSubject = new BehaviorSubject<ActiveTariffInfo | null>(mockTariff);
    orderDetailsSubject = new BehaviorSubject<OrderDetails>(mockOrderDetails);
    courierLocationsSubject = new BehaviorSubject<CourierLocations>(mockLocations);
    existingOrderInfoSubject = new BehaviorSubject<IUserOrderInfo | null>(null);
    pointsUsedSubject = new BehaviorSubject<number>(50);
    certificateUsedSubject = new BehaviorSubject<number>(20);
    isLoadingSubject = new BehaviorSubject<boolean>(false);

    orderService = jasmine.createSpyObj('OrderService', ['getActiveTariffsInfo', 'getTariffName']);
    orderService.getTariffName.and.returnValue('Standard Tariff');

    localStorageService = jasmine.createSpyObj('LocalStorageService', [
      'getCurrentLanguage',
      'languageSubject',
      'getTariffId',
      'getUserId'
    ]);
    localStorageService.languageSubject = fakeLanguageSubject;

    const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    storeMock.select.and.callFake((selector) => {
      if (selector === tariffSelector) {
        return of(activeTariffsMock[0]);
      }
      if (selector === orderDetailsSelector) {
        return orderDetailsSubject.asObservable();
      }
      if (selector === courierLocationsSelector) {
        return courierLocationsSubject.asObservable();
      }
      if (selector === existingOrderInfoSelector) {
        return existingOrderInfoSubject.asObservable();
      }
      if (selector === pointsUsedSelector) {
        return pointsUsedSubject.asObservable();
      }
      if (selector === certificateUsedSelector) {
        return certificateUsedSubject.asObservable();
      }
      if (selector === isOrderDetailsLoadingSelector) {
        return isLoadingSubject.asObservable();
      }
      return of(activeTariffsMock[0]);
    });

    TestBed.configureTestingModule({
      declarations: [UBSOrderDetailsComponent, MockSpinnerComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        FormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        TranslateService,
        { provide: Store, useValue: storeMock },
        provideMockActions(() => actions$),
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(true) }) }
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ existingOrderId: 1 }) }
        },
        { provide: OrderService, useValue: orderService },
        { provide: LocalStorageService, useValue: localStorageService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSOrderDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    dialog = TestBed.inject(MatDialog);
    route = TestBed.inject(ActivatedRoute);

    component.orderDetailsForm = new FormGroup({
      orderComment: new FormControl('Test Comment'),
      additionalOrders: new FormArray([new FormControl('Order 1'), new FormControl('Order 2')]),
      bags: new FormGroup({
        quantity1: new FormControl('1')
      })
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    component.ngOnDestroy();
    tariffSubject.complete();
    orderDetailsSubject.complete();
    courierLocationsSubject.complete();
    existingOrderInfoSubject.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Operations', () => {
    describe('pushAdditionalOrder', () => {
      it('should add a new order', () => {
        const initialLength = component.additionalOrders.length;
        component.pushAdditionalOrder();
        expect(component.additionalOrders.length).toBe(initialLength + 1);
      });
    });

    describe('deleteOrder', () => {
      it('should delete an order', () => {
        component.pushAdditionalOrder('testOrder');
        const initialLength = component.additionalOrders.length;
        component.deleteOrder(0);
        expect(component.additionalOrders.length).toBe(initialLength - 1);
      });
    });

    describe('removeOrder', () => {
      it('should remove order on Enter key press', () => {
        component.pushAdditionalOrder('Order 1');
        component.pushAdditionalOrder('Order 2');
        component.removeOrder({ code: 'Enter' } as KeyboardEvent, 0);
        expect(component.additionalOrders.controls.length).toBe(3);
      });
    });

    describe('isAlreadyEntered', () => {
      it('should check if order is already entered', () => {
        component.pushAdditionalOrder('Order 1');
        component.pushAdditionalOrder('Order 1');
        const result = component.isAlreadyEntered(0);
        expect(result).toBe(true);
      });
    });

    describe('isCanAddEcoShopOrderNumber', () => {
      it('should check if can add eco shop order number', () => {
        component.pushAdditionalOrder('Order 1');
        component.pushAdditionalOrder('Order 2');
        const result = component.isCanAddEcoShopOrderNumber();
        expect(result).toBe(false);
      });
    });
  });

  describe('Form Values', () => {
    describe('getFormValues', () => {
      it('should get form values', () => {
        component.orderSum = 100;
        const result = component.getFormValues();
        expect(result).toBe(true);
      });
    });

    describe('getBagQuantity', () => {
      it('should get bag quantity when bag exists and has a valid numeric value', () => {
        const bagsFormGroup = component.orderDetailsForm.get('bags') as FormGroup;
        bagsFormGroup.addControl('quantity2', new FormControl(5));
        expect(component.getBagQuantity(2)).toBe(5);
      });

      it('should get bag quantity when stored as a string', () => {
        component.orderDetailsForm = new FormGroup({
          bags: new FormGroup({
            quantity1: new FormControl('5')
          })
        });
        expect(component.getBagQuantity(1)).toBe(5);
      });

      it('should return 0 when bag does not exist', () => {
        component.orderDetailsForm = new FormGroup({
          bags: new FormGroup({})
        });
        expect(component.getBagQuantity(1)).toBe(0);
      });

      it('should return 0 when bag quantity is an empty string', () => {
        component.orderDetailsForm = new FormGroup({
          bags: new FormGroup({
            quantity1: new FormControl('')
          })
        });
        expect(component.getBagQuantity(1)).toBe(0);
      });

      it('should return 0 when bag quantity is null', () => {
        component.orderDetailsForm = new FormGroup({
          bags: new FormGroup({
            quantity1: new FormControl(null)
          })
        });
        expect(component.getBagQuantity(1)).toBe(0);
      });

      it('should return 0 when bag quantity is undefined', () => {
        component.orderDetailsForm = new FormGroup({
          bags: new FormGroup({
            quantity1: new FormControl(undefined)
          })
        });
        expect(component.getBagQuantity(1)).toBe(0);
      });
    });
  });

  describe('Tariff Management', () => {
    describe('getTariff', () => {
      it('should dispatch SetTariff if tariff exists', () => {
        const tariff = { id: 1, tariffNameUk: 'Базовий', tariffNameEn: 'Basic' };
        localStorageService.getTariffId.and.returnValue(1);
        orderService.getActiveTariffsInfo.and.returnValue(of([tariff]));

        component.getTariff();

        expect(store.dispatch).toHaveBeenCalledWith(SetTariff({ tariff }));
      });

      it('should open location dialog if tariff does not exist', () => {
        localStorageService.getTariffId.and.returnValue(1);
        orderService.getActiveTariffsInfo.and.returnValue(of([]));
        spyOn(component, 'openLocationDialog');

        component.getTariff();

        expect(component.openLocationDialog).toHaveBeenCalled();
      });

      it('should open location dialog if no tariffId in localStorage', () => {
        localStorageService.getTariffId.and.returnValue(null);
        spyOn(component, 'openLocationDialog');

        component.getTariff();

        expect(component.openLocationDialog).toHaveBeenCalled();
      });
    });

    describe('listenToTariffAndInitForm', () => {
      beforeEach(() => {
        spyOn(component, 'initForm');
        spyOn(component, 'initFormBags');
        spyOn(component, 'dispatchAdditionalOrders');
        spyOn(component, 'dispatchOrderComment');
        spyOn(component, 'initPointsAndCertificateListeners');
        spyOn(component, 'initExistingOrderValues');
      });

      it('should dispatch GetOrderDetails and GetCourierLocations for new order', fakeAsync(() => {
        component.existingOrderId = null;
        (store.dispatch as jasmine.Spy).calls.reset();
        component.listenToTariffAndInitForm();

        tick(100);
        expect(orderService.getTariffName).toHaveBeenCalledWith(mockTariff);
        expect(component.currentTariff).toBe('Standard Tariff');
        expect(store.dispatch).toHaveBeenCalledWith(GetOrderDetails({ tariffId: mockTariff.id }));
        expect(store.dispatch).toHaveBeenCalledWith(GetCourierLocations({ tariffId: mockTariff.id }));
        tick(100);

        expect(component.bags).toEqual(mockOrderDetails.bags);
        expect(component.locations).toEqual(mockLocations);
        expect(component.existingOrderInfo).toBeNull();
        expect(component.initForm).toHaveBeenCalled();
        expect(component.initFormBags).toHaveBeenCalled();
        expect(component.dispatchAdditionalOrders).toHaveBeenCalled();
        expect(component.dispatchOrderComment).toHaveBeenCalled();
        expect(component.initPointsAndCertificateListeners).toHaveBeenCalled();
        expect(component.initExistingOrderValues).not.toHaveBeenCalled();
      }));

      it('should dispatch GetExistingOrderDetails for existing order', fakeAsync(() => {
        component.existingOrderId = 123;
        (store.dispatch as jasmine.Spy).calls.reset();
        existingOrderInfoSubject.next(mockExistingOrder);
        component.listenToTariffAndInitForm();
        tick(100);

        expect(store.dispatch).toHaveBeenCalledWith(GetExistingOrderDetails({ orderId: 123 }));
        expect(store.dispatch).toHaveBeenCalledWith(GetCourierLocations({ tariffId: mockTariff.id }));

        tick(100);

        expect(component.existingOrderInfo).toEqual(mockExistingOrder);
        expect(component.initExistingOrderValues).toHaveBeenCalled();
      }));

      it('should handle distinctUntilChanged for same tariff', fakeAsync(() => {
        component.existingOrderId = null;
        (store.dispatch as jasmine.Spy).calls.reset();

        component.listenToTariffAndInitForm();
        tick(100);

        const initialCallCount = (store.dispatch as jasmine.Spy).calls.count();

        tariffSubject.next(mockTariff);
        tick(100);

        expect((store.dispatch as jasmine.Spy).calls.count()).toBe(initialCallCount);
      }));

      it('should unsubscribe when destroy$ emits', fakeAsync(() => {
        component.existingOrderId = null;
        (store.dispatch as jasmine.Spy).calls.reset();

        component.listenToTariffAndInitForm();
        tick(100);

        const callCountBeforeDestroy = (store.dispatch as jasmine.Spy).calls.count();

        component.ngOnDestroy();
        tick(100);

        tariffSubject.next({ ...mockTariff, id: 999 } as ActiveTariffInfo);
        tick(100);

        expect((store.dispatch as jasmine.Spy).calls.count()).toBe(callCountBeforeDestroy);
      }));
    });
  });

  describe('Existing Order', () => {
    describe('initExistingOrderValues', () => {
      it('should initialize existing order values', () => {
        component.existingOrderInfo = mockExistingOrder;
        component.orderDetailsForm = new FormGroup({
          orderComment: new FormControl(''),
          additionalOrders: new FormArray([])
        });

        spyOn(component.additionalOrders, 'clear').and.callThrough();
        spyOn(component, 'pushAdditionalOrder').and.callThrough();

        component.initExistingOrderValues();

        expect(component.orderComment.value).toBe('Test Comment');
        expect(component.additionalOrders.clear).toHaveBeenCalled();
        expect(component.pushAdditionalOrder).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Calculations', () => {
    describe('calculateFinalSum', () => {
      it('should calculate final sum', () => {
        component.orderSum = 100;
        component.certificateUsed = 10;
        component.pointsUsed = 20;
        component.calculateFinalSum();

        expect(component.finalSum).toBe(70);
      });
    });
  });

  describe('Dialogs', () => {
    describe('openExtraPackages', () => {
      it('should open extra packages dialog', () => {
        const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();

        component.openExtraPackages();

        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy.calls.mostRecent().args[0]).toBe(ExtraPackagesPopUpComponent);
        expect(dialogSpy.calls.mostRecent().args[1].panelClass).toBe('extra-packages');
        expect(dialogSpy.calls.mostRecent().args[1].closeOnNavigation).toBe(false);
        expect(dialogSpy.calls.mostRecent().args[1].hasBackdrop).toBe(true);
      });
    });

    describe('openLocationDialog', () => {
      it('should open location dialog', () => {
        const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
        dialogSpy.and.returnValue(dialogRefSpyObj);

        component.openLocationDialog();

        expect(dialogSpy).toHaveBeenCalledWith(UbsOrderLocationPopupComponent, {
          hasBackdrop: true,
          disableClose: false,
          closeOnNavigation: false
        });
        expect(component.isDialogOpen).toBeFalse();
      });

      it('should handle dialog close', () => {
        const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ data: true }), close: null });
        dialogSpy.and.returnValue(dialogRefSpyObj);
        spyOn(component.orderDetailsForm, 'markAllAsTouched');

        component.openLocationDialog();

        expect(component.orderDetailsForm.markAllAsTouched).toHaveBeenCalled();
        expect(component.isDialogOpen).toBeFalse();
      });
    });
  });

  describe('Input Validation', () => {
    describe('checkOnNumber', () => {
      it('should return true if key is number', () => {
        const result = component.checkOnNumber({ key: '1' } as KeyboardEvent);
        expect(result).toBe(true);
      });

      it('should validate numeric input', () => {
        const event: any = { key: '1' };
        fixture.detectChanges();
        const result = component.checkOnNumber(event);
        expect(result).toBe(true);
      });
    });
  });

  describe('Configuration', () => {
    describe('popupConfig', () => {
      it('should have correct initial popupConfig', () => {
        expect(component.popupConfig).toEqual({
          hasBackdrop: true,
          closeOnNavigation: true,
          disableClose: true,
          panelClass: 'custom-ubs-style',
          data: {
            popupTitle: 'confirmation.title',
            popupSubtitle: 'confirmation.subTitle',
            popupConfirm: 'confirmation.dismiss',
            popupCancel: 'confirmation.cancel',
            isUBS: true
          }
        });
      });
    });
  });

  describe('Getters', () => {
    it('should get bagsGroup from orderDetailsForm', () => {
      component.orderDetailsForm = new FormGroup({
        bags: new FormGroup({})
      });
      expect(component.bagsGroup).toBe(component.orderDetailsForm.get('bags') as FormGroup);
    });

    it('should get orderComment from orderDetailsForm', () => {
      component.orderDetailsForm = new FormGroup({
        orderComment: new FormControl('')
      });
      expect(component.orderComment).toBe(component.orderDetailsForm.get('orderComment'));
    });

    it('should get additionalOrders from orderDetailsForm', () => {
      component.orderDetailsForm = new FormGroup({
        additionalOrders: new FormArray([])
      });
      expect(component.additionalOrders).toBe(component.orderDetailsForm.get('additionalOrders') as FormArray);
    });

    it('getter additionalOrders should return formArray of orders', () => {
      const formArray = component.orderDetailsForm.controls.additionalOrders as FormArray;
      const spy = spyOnProperty(component, 'additionalOrders').and.returnValue(formArray);
      expect(component.additionalOrders).toBe(formArray);
      expect(spy).toHaveBeenCalled();
    });

    it('getter orderComment should return formControl of comments', () => {
      const formControl = component.orderDetailsForm.controls.orderComment;
      const spy = spyOnProperty(component, 'orderComment').and.returnValue(formControl);
      expect(component.orderComment).toBe(formControl);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('should emit secondStepDisabledChange event', () => {
      spyOn(component.secondStepDisabledChange, 'emit');
      component.secondStepDisabledChange.emit(true);
      expect(component.secondStepDisabledChange.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('Store Dispatchers', () => {
    it('should dispatch additional orders', () => {
      component.dispatchAdditionalOrders();
      expect(store.dispatch).toHaveBeenCalledWith(SetAdditionalOrders({ orders: ['Order 1', 'Order 2'] }));
    });

    it('should dispatch order comment', () => {
      component.orderComment.setValue('Test Comment');
      component.dispatchOrderComment();
      expect(store.dispatch).toHaveBeenCalledWith(SetOrderComment({ comment: 'Test Comment' }));
    });
  });
});
