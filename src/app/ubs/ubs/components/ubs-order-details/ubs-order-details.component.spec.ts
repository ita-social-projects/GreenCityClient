import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { UBSOrderDetailsComponent } from './ubs-order-details.component';
import { Component } from '@angular/core';
import { fakeInputOrderData, mockCourierLocations, ubsOrderServiseMock } from '@ubs/mocks/order-data-mock';
import {
  certificateUsedSelector,
  courierLocationsSelector,
  isOrderDetailsLoadingSelector,
  locationIdSelector,
  orderDetailsSelector,
  pointsUsedSelector
} from 'src/app/store/selectors/order.selectors';
import { CourierLocations, OrderDetails } from '@ubs/ubs/models/ubs.interface';
import { IUserOrderInfo } from '@ubs/ubs-user/components/ubs-user-orders-list/models/UserOrder.interface';
import { GetExistingOrderDetails, GetExistingOrderTariff, SetAdditionalOrders, SetOrderComment } from 'src/app/store/actions/order.actions';
import { ExtraPackagesPopUpComponent } from '@ubs/ubs/components/ubs-order-details/extra-packages-pop-up/extra-packages-pop-up.component';
import { UbsOrderLocationPopupComponent } from '@ubs/ubs/components/ubs-order-details/ubs-order-location-popup/ubs-order-location-popup.component';

@Component({
  selector: 'app-spinner',
  template: '<div></div>'
})
export class MockSpinnerComponent {}

describe('UBSOrderDetailsComponent', () => {
  let component: UBSOrderDetailsComponent;
  let fixture: ComponentFixture<UBSOrderDetailsComponent>;
  let store: Store;
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));
  let dialog: MatDialog;
  let route: ActivatedRoute;
  let mockStore: any;
  let initListenersSpy: jasmine.Spy;
  let initExistingOrderValuesSpy: jasmine.Spy;

  const orderServiceMock = jasmine.createSpyObj('OrderService', [
    'getOrders',
    'getPersonalData',
    'getTariffForExistingOrder',
    'setOrderDetailsFromState'
  ]);
  orderServiceMock.getOrders.and.returnValue(of());
  orderServiceMock.getPersonalData.and.returnValue(of(storeMock.personalData));
  orderServiceMock.getTariffForExistingOrder.and.returnValue(of());
  orderServiceMock.setOrderDetailsFromState.and.returnValue(of());

  const fakeLanguageSubject: Subject<string> = new Subject<string>();

  const localStorageService = jasmine.createSpyObj('localStorageService', [
    'getCurrentLanguage',
    'languageSubject',
    'getUbsOrderData',
    'getLocations',
    'removeUbsOrderAndPersonalData',
    'removeanotherClientData',
    'getLocationId',
    'getTariffId'
  ]);
  localStorageService.getUbsOrderData = () => null;
  localStorageService.languageSubject = fakeLanguageSubject;

  beforeEach(waitForAsync(() => {
    mockStore = {
      pipe: jasmine.createSpy('pipe').and.callFake((selector) => {
        switch (selector) {
          case isOrderDetailsLoadingSelector:
            return new BehaviorSubject<boolean>(false);
          case courierLocationsSelector:
            return new BehaviorSubject<CourierLocations>({} as CourierLocations);
          case orderDetailsSelector:
            return new BehaviorSubject<OrderDetails>({ bags: [{ id: 1 }] } as OrderDetails);
          case locationIdSelector:
            return new BehaviorSubject<number>(1);
          case pointsUsedSelector:
            return new BehaviorSubject<number>(50);
          case certificateUsedSelector:
            return new BehaviorSubject<number>(20);
          default:
            return of(null);
        }
      }),
      dispatch: jasmine.createSpy('dispatch')
    };

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
        { provide: Store, useValue: mockStore },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(true) }) }
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ existingOrderId: 1 }) }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSOrderDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initListeners', () => {
    it('should initialize listeners on init', () => {
      spyOn(component, 'initListeners');
      component.ngOnInit();
      expect(component.initListeners).toHaveBeenCalled();
    });
  });

  describe('addOrder', () => {
    it('should add a new order', () => {
      const initialLength = component.additionalOrders.length;
      component.addOrder();
      expect(component.additionalOrders.length).toBe(initialLength + 1);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', () => {
      component.addOrder('testOrder');
      const initialLength = component.additionalOrders.length;
      component.deleteOrder(0);
      expect(component.additionalOrders.length).toBe(initialLength - 1);
    });
  });

  describe('removeOrder', () => {
    it('should remove order on Enter key press', () => {
      component.addOrder('Order 1');
      component.addOrder('Order 2');
      component.removeOrder({ code: 'Enter' } as KeyboardEvent, 0);
      expect(component.additionalOrders.controls.length).toBe(2);
    });
  });

  describe('isAlreadyEntered', () => {
    it('should check if order is already entered', () => {
      component.addOrder('Order 1');
      component.addOrder('Order 1');
      const result = component.isAlreadyEntered(0);
      expect(result).toBe(false);
    });
  });

  describe('isCanAddEcoShopOrderNumber', () => {
    it('should check if can add eco shop order number', () => {
      component.addOrder('Order 1');
      component.addOrder('Order 2');
      const result = component.isCanAddEcoShopOrderNumber();

      expect(result).toBe(false);
    });
  });

  describe('getFormValues', () => {
    it('should get form values', () => {
      component.orderSum = 100;
      const result = component.getFormValues();

      expect(result).toBe(true);
    });
  });

  describe('initExistingOrderValues', () => {
    it('should initialize existing order values', () => {
      component.existingOrderInfo = {
        orderComment: 'Test Comment',
        additionalOrders: ['Order 1', 'Order 2']
      } as IUserOrderInfo;

      component.orderDetailsForm = new FormGroup({
        orderComment: new FormControl(''),
        additionalOrders: new FormArray([])
      });

      spyOn(component.additionalOrders, 'clear').and.callThrough();
      spyOn(component, 'addOrder').and.callThrough();

      component.initExistingOrderValues();

      expect(component.orderComment.value).toBe('Test Comment');
      expect(component.additionalOrders.clear).toHaveBeenCalled();
      expect(component.addOrder).toHaveBeenCalledTimes(2);
    });
  });

  describe('fetchDataForExistingOrder', () => {
    beforeEach(() => {
      initListenersSpy = spyOn(component, 'initListeners');
      initExistingOrderValuesSpy = spyOn(component, 'initExistingOrderValues');
    });

    it('should dispatch actions and pick up both selectors', () => {
      component.existingOrderId = 1;

      (mockStore.pipe as jasmine.Spy).and.returnValue(of(null));
      component.fetchDataForExistingOrder();
      expect(store.dispatch).toHaveBeenCalledWith(GetExistingOrderDetails({ orderId: 1 }));
      expect(store.dispatch).toHaveBeenCalledWith(GetExistingOrderTariff({ orderId: 1 }));

      (mockStore.pipe as jasmine.Spy).and.returnValue(of(1));
      component.fetchDataForExistingOrder();
      expect(component.locationId).toBe(1);
      expect(initListenersSpy).toHaveBeenCalled();

      const fakeInfo = JSON.parse(JSON.stringify(fakeInputOrderData)) as IUserOrderInfo;
      (mockStore.pipe as jasmine.Spy).and.returnValue(of(fakeInfo));
      component.fetchDataForExistingOrder();
      expect(component.existingOrderInfo).toEqual(fakeInfo);
      expect(initExistingOrderValuesSpy).toHaveBeenCalled();
    });
  });

  describe('calculateFinalSum', () => {
    it('should calculate final sum', () => {
      component.orderSum = 100;
      component.certificateUsed = 10;
      component.pointsUsed = 20;
      component.calculateFinalSum();

      expect(component.finalSum).toBe(70);
    });
  });

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

  describe('initLocation', () => {
    it('should initialize location', () => {
      component.locations = mockCourierLocations;
      component.locationId = 1;
      component.initLocation();

      expect(component.currentLocation).toBe('Kyiv');
    });
  });

  describe('checkOnNumber', () => {
    it('should check on number', () => {
      const result = component.checkOnNumber({ key: '1' } as KeyboardEvent);
      expect(result).toBe(true);
    });

    it('method checkOnNumber should return true if key is number', () => {
      const event: any = { key: '1' };
      fixture.detectChanges();
      const result = component.checkOnNumber(event);
      expect(result).toBe(true);
    });
  });

  describe('getBagQuantity', () => {
    it('should get bag quantity when bag exists and has a valid numeric value', () => {
      const bagsFormGroup = component.orderDetailsForm.get('bags') as FormGroup;
      bagsFormGroup.addControl('quantity1', new FormControl(5));
      expect(component.getBagQuantity(1)).toBe(5);
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
          popupConfirm: 'confirmation.cancel',
          popupCancel: 'confirmation.dismiss',
          isUBS: true
        }
      });
    });
  });

  describe('get data', () => {
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

    it('should get bagsGroup from form', () => {
      const bagsGroup = component.bagsGroup as FormGroup;
      expect(bagsGroup).toBe(component.orderDetailsForm.get('bags') as FormGroup);
    });

    it('should get orderComment from form', () => {
      const orderComment = component.orderComment;
      expect(orderComment).toBe(component.orderDetailsForm.get('orderComment'));
    });

    it('should get additionalOrders from form', () => {
      const additionalOrders = component.additionalOrders as FormArray;
      expect(additionalOrders).toBe(component.orderDetailsForm.get('additionalOrders') as FormArray);
    });

    it('should get bagsGroup', () => {
      const bagsGroup = component.bagsGroup;
      expect(bagsGroup).toBeTruthy();
    });

    it('should get additionalOrders', () => {
      const additionalOrders = component.additionalOrders;
      expect(additionalOrders.controls.length).toBe(1);
    });

    it('should get additionalOrders', () => {
      const additionalOrders = component.additionalOrders;
      expect(additionalOrders.controls.length).toBeGreaterThan(0);
    });
  });

  describe('emit event', () => {
    it('should emit secondStepDisabledChange event', () => {
      spyOn(component.secondStepDisabledChange, 'emit');
      component.secondStepDisabledChange.emit(true);
      expect(component.secondStepDisabledChange.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('getters', () => {
    it('getter additionalOrders should return formArray of orders', () => {
      const formArray = component.orderDetailsForm.controls.additionalOrders as FormArray;
      const spy = spyOnProperty(component, 'additionalOrders').and.returnValue(formArray);
      expect(component.additionalOrders).toBe(formArray);
      expect(spy).toHaveBeenCalled();
    });

    it('getter orderComment should return formArray of comments', () => {
      const formArray = component.orderDetailsForm.controls.orderComment as FormArray;
      const spy = spyOnProperty(component, 'orderComment').and.returnValue(formArray);
      expect(component.orderComment).toBe(formArray);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('dispatch data', () => {
    it('should dispatch additional orders', () => {
      component.additionalOrders.push(new FormControl('Order 1'));
      component.additionalOrders.push(new FormControl('Order 2'));
      component.dispatchAdditionalOrders();
      expect(mockStore.dispatch).toHaveBeenCalledWith(SetAdditionalOrders({ orders: ['Order 1', 'Order 2'] }));
    });

    it('should dispatch order comment', () => {
      component.orderComment.setValue('Test Comment');
      component.dispatchOrderComment();
      expect(mockStore.dispatch).toHaveBeenCalledWith(SetOrderComment({ comment: 'Test Comment' }));
    });
  });

  describe('bagErrors', () => {
    it('should return only all bags errors if there is anything else', () => {
      component.orderDetailsForm.get('bags').setErrors({
        someError: { message: 'Invalid quantity', value: 2 },
        anotherError: { message: 'Too many items' },
        notRelevant: 'string-error'
      });

      expect(component.bagErrors).toEqual([{ message: 'Invalid quantity', value: 2 }, { message: 'Too many items' }]);
    });

    it('should return empty array if bugs errors are not an object', () => {
      component.orderDetailsForm.get('bags').setErrors(null);

      expect(component.bagErrors).toEqual([]);
    });

    it('should return empty array if error object does not have message property', () => {
      component.orderDetailsForm.get('bags').setErrors({
        invalidType: { value: 1 },
        wrongShape: { msg: 'Not a real message' }
      });

      expect(component.bagErrors).toEqual([]);
    });
  });
});
