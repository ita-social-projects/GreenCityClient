import { RouterTestingModule } from '@angular/router/testing';
import { Language } from '../../../../main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { LocalizedCurrencyPipe } from '../../../../shared/localized-currency-pipe/localized-currency.pipe';
import { Bag, OrderDetails } from '../../models/ubs.interface';
import { OrderService } from '../../services/order.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSOrderDetailsComponent } from './ubs-order-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup/ubs-order-location-popup.component';
import { IMaskModule } from 'angular-imask';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { FilterLocationListByLangPipe } from 'src/app/shared/filter-location-list-by-lang/filter-location-list-by-lang.pipe';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { limitStatus } from 'src/app/ubs/ubs-admin/components/ubs-admin-tariffs/ubs-tariffs.enum';
import { Store } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';

describe('OrderDetailsFormComponent', () => {
  let component: UBSOrderDetailsComponent;
  let fixture: ComponentFixture<UBSOrderDetailsComponent>;
  let orderService: OrderService;

  const fakeLanguageSubject: Subject<string> = new Subject<string>();
  const shareFormService = jasmine.createSpyObj('shareFormService', ['orderDetails', 'changeAddCertButtonVisibility']);
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
  const mockLocations = {
    courierLimit: 'fake',
    courierStatus: 'fake status',
    tariffInfoId: 1,
    regionDto: {
      nameEn: 'fake name en',
      nameUk: 'fake name ua',
      regionId: 2
    },
    locationsDtosList: [
      {
        locationId: 3,
        nameEn: 'fake location en',
        nameUk: 'fake location ua'
      }
    ],
    courierTranslationDtos: [
      {
        languageCode: 'ua',
        name: 'fake name'
      }
    ],
    maxAmountOfBigBags: 99,
    maxPriceOfOrder: 500000,
    minAmountOfBigBags: 2,
    minPriceOfOrder: 500
  };
  const bagsMock: Bag[] = [];
  const ordersMock = {
    points: 0,
    bags: [
      { code: 'ua', capacity: 100, id: 0, locationId: 1, price: 300, quantity: 10, nameEng: 'def', name: 'def' },
      { code: 'ua', capacity: 100, id: 1, locationId: 1, price: 300, quantity: 10, nameEng: 'def', name: 'def' }
    ]
  };

  const orderDetailsMock: OrderDetails = {
    bags: [
      { code: 'ua', capacity: 100, id: 0, price: 300, quantity: 10, nameEng: 'def', name: 'def' },
      { code: 'ua', capacity: 100, id: 1, price: 300, quantity: 10, nameEng: 'def', name: 'def' }
    ],
    points: 0
  };

  const personalDataMock = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    addressComment: '',
    city: '',
    cityEn: '',
    district: '',
    districtEn: '',
    street: '',
    streetEn: '',
    houseCorpus: '',
    entranceNumber: '',
    houseNumber: '',
    longitude: 1,
    latitude: 0,
    senderFirstName: '',
    senderLastName: '',
    senderEmail: '',
    senderPhoneNumber: ''
  };

  shareFormService.locationId = 1;
  shareFormService.locations = mockLocations;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valUa;
  };

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  const orderServiceMock = jasmine.createSpyObj('OrderService', ['getOrders', 'getPersonalData']);
  orderServiceMock.getOrders.and.returnValue(of());
  orderServiceMock.getPersonalData.and.returnValue(of(storeMock.personalData));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UBSOrderDetailsComponent, LocalizedCurrencyPipe, UbsOrderLocationPopupComponent, FilterLocationListByLangPipe],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        IMaskModule
      ],
      providers: [
        MatDialog,
        { provide: Store, useValue: storeMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: UBSOrderFormService, useValue: shareFormService },
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: OrderService, useValue: orderServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(UBSOrderDetailsComponent);
    component = fixture.componentInstance;
    spyOn(component, 'saveLocation');
    fixture.detectChanges();
    orderService = TestBed.inject(OrderService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call takeOrderData and subscribeToLangChange', () => {
    const spy1 = spyOn(component as any, 'takeOrderData');
    const spy2 = spyOn(component as any, 'subscribeToLangChange');
    fixture.detectChanges();
    component.ngOnInit();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('method takeOrderData should invoke localStorageService.getCurrentLanguage method', () => {
    const mock: OrderDetails = {
      bags: [{ id: 0, code: 'ua' }],
      points: 0
    };
    spyOn(global, 'setTimeout');
    shareFormService.orderDetails = mock;
    localStorageService.getCurrentLanguage.and.callFake(() => Language.UA);
    fixture.detectChanges();
    component.takeOrderData();
    expect(component.currentLanguage).toBe('ua');
    component.bags = [{ id: 0, code: 'ua' }];
    component.orders = {
      bags: [{ id: 0, code: 'ua' }],
      points: 0
    };
    expect(component.bags).toEqual(component.orders.bags);
  });

  it('method checkOnNumber should return true if key is number', () => {
    const event: any = { key: '1' };
    fixture.detectChanges();
    const result = component.checkOnNumber(event);

    expect(result).toBe(true);
  });

  it('method takeOrderData should invoke expected methods', () => {
    component.isThisExistingOrder = true;
    fixture.detectChanges();
    component.takeOrderData();

    expect(localStorageService.removeUbsOrderAndPersonalData).toHaveBeenCalled();
    expect(localStorageService.removeanotherClientData).toHaveBeenCalled();
  });

  it('method filterBags should sord bags', () => {
    (component as any).orders = {
      bags: [
        { id: 1, price: 250 },
        { id: 2, price: 300 },
        { id: 3, price: 50 }
      ]
    };
    fixture.detectChanges();
    (component as any).filterBags();

    expect((component as any).bags).toEqual([
      { id: 2, price: 300 },
      { id: 1, price: 250 },
      { id: 3, price: 50 }
    ]);
  });

  it('method clearOrderValues should invoke ecoStoreValidation method', () => {
    const spy = spyOn(component, 'ecoStoreValidation');
    component.clearOrderValues();
    expect(spy).toHaveBeenCalled();
  });

  it('method onQuantityChange should invoke calculateTotal method', () => {
    const spy = spyOn<any>(component, 'calculateTotal');
    const fakeElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(fakeElement);
    component.bags = bagsMock;
    fixture.detectChanges();
    component.onQuantityChange();
    expect(spy).toHaveBeenCalled();
  });

  it('method calculateTotal should invoke changeOrderDetails method', () => {
    const spy = spyOn<any>(component, 'changeOrderDetails');
    (component as any).calculateTotal();
    expect(spy).toHaveBeenCalled();
  });

  it('method addOrder should invoke ecoStoreValidation method', () => {
    const spy = spyOn(component, 'ecoStoreValidation');
    spyOn(global, 'setTimeout');
    component.addOrder();
    expect(spy).toHaveBeenCalled();
  });

  it('method setLocation should invoke setLimitsValues if locationId exists', () => {
    const spy = spyOn(component, 'setLimitsValues');
    component.setLocation(2);
    expect(spy).toHaveBeenCalled();
  });

  it('should open location dialog if locationId does not exists', () => {
    const spy = spyOn(component, 'openLocationDialog');
    component.setLocation(null);
    expect(spy).toHaveBeenCalled();
  });

  it('method setLimitsValues should invoke checkCourierLimit', () => {
    const spy = spyOn(component, 'checkCourierLimit');
    component.setLimitsValues();
    expect(spy).toHaveBeenCalled();
  });

  it('method setLimitsValues should invoke validateBags', () => {
    const spy = spyOn(component as any, 'validateBags');
    component.setLimitsValues();
    expect(spy).toHaveBeenCalled();
  });

  it('method setLimitsValues should invoke validateSum', () => {
    const spy = spyOn(component as any, 'validateSum');
    component.setLimitsValues();
    expect(spy).toHaveBeenCalled();
  });

  it('method setCurrentLocation should be called', () => {
    const spy = spyOn<any>(component, 'setCurrentLocation');
    (component as any).setCurrentLocation('en');
    expect(spy).toHaveBeenCalled();
  });

  it('checkCourierLimit should check and set courierLimitByAmount', () => {
    mockLocations.courierLimit = limitStatus.limitByAmountOfBag;
    component.checkCourierLimit();
    fixture.detectChanges();
    expect(component.courierLimitByAmount).toBeTruthy();
  });

  it('validateBags should set courierLimitValidation', () => {
    component.courierLimitByAmount = true;
    (component as any).validateBags();
    fixture.detectChanges();
    expect(component.courierLimitValidation).toBeFalsy();
  });

  it('validateSum should set courierLimitValidation', () => {
    component.courierLimitBySum = true;
    (component as any).validateSum();
    fixture.detectChanges();
    expect(component.courierLimitValidation).toBeFalsy();
  });

  it('saveLocation should set isFetching', () => {
    (component as any).saveLocation();
    expect(component.isFetching).toBeTruthy();
    (component as any).setCurrentLocation();
    expect(component.changeLocation).toBeFalsy();
  });

  it('changeForm should set orderSum', () => {
    component.showTotal = 0;
    const orderSum = component.orderDetailsForm.controls.orderSum.value;
    (component as any).changeForm();
    expect(orderSum).toEqual(0);
  });

  it('getter formArrayCertificates should return formArray of certificates', () => {
    const formArray = component.orderDetailsForm.controls.formArrayCertificates as FormArray;
    const spy = spyOnProperty(component, 'formArrayCertificates').and.returnValue(formArray);
    expect(component.formArrayCertificates).toBe(formArray);
    expect(spy).toHaveBeenCalled();
  });

  it(' should return ua Value by getLangValue', () => {
    const value = component.getLangValue('uaValue', 'enValue');
    expect(value).toBe('uaValue');
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy = new Subject<boolean>();
    const nextSpy = spyOn((component as any).destroy, 'next');
    const unsubscribeSpy = spyOn((component as any).destroy, 'unsubscribe');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });
});
