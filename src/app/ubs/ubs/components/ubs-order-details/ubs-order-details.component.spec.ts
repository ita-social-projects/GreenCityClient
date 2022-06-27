import { RouterTestingModule } from '@angular/router/testing';
import { Language } from '../../../../main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { LocalizedCurrencyPipe } from '../../../../shared/localized-currency-pipe/localized-currency.pipe';
import { Bag, OrderDetails } from '../../models/ubs.interface';
import { OrderService } from '../../services/order.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSOrderDetailsComponent } from './ubs-order-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup/ubs-order-location-popup.component';
import { IMaskModule } from 'angular-imask';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { FilterLocationListByLangPipe } from 'src/app/shared/filter-location-list-by-lang/filter-location-list-by-lang.pipe';

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
    'removeanotherClientData'
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
  shareFormService.locationId = 1;
  shareFormService.locations = mockLocations;

  beforeEach(async(() => {
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
        { provide: MatDialogRef, useValue: {} },
        { provide: UBSOrderFormService, useValue: shareFormService },
        { provide: LocalStorageService, useValue: localStorageService }
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
    orderService = TestBed.inject(OrderService);
    spyOn(global, 'setTimeout');
    const spy = spyOn(orderService, 'getOrders').and.returnValue(of(mock));
    shareFormService.orderDetails = mock;
    localStorageService.getCurrentLanguage.and.callFake(() => Language.UA);
    fixture.detectChanges();
    component.takeOrderData();
    expect(component.currentLanguage).toBe('ua');
    expect(spy).toHaveBeenCalled();
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

  it('method calculateTotal should invoke methods', () => {
    const spy = spyOn(component, 'changeForm');
    const spy1 = spyOn(component, 'changeOrderDetails');
    component.bags = [];
    fixture.detectChanges();
    (component as any).calculateTotal();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
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

  it('method addOrder should invoke ecoStoreValidation method', () => {
    const spy = spyOn(component, 'ecoStoreValidation');
    spyOn(global, 'setTimeout');
    component.addOrder();
    expect(spy).toHaveBeenCalled();
  });

  it('method setLimitsValues should invoke checkCourierLimit method', () => {
    const spy = spyOn(component, 'checkCourierLimit');
    component.setLimitsValues();
    expect(spy).toHaveBeenCalled();
  });

  it('method setLimitsValues should invoke validateBags method', () => {
    const spy = spyOn(component, 'validateBags');
    component.setLimitsValues();
    expect(spy).toHaveBeenCalled();
  });

  it('method setLimitsValues should invoke validateSum method', () => {
    const spy = spyOn(component, 'validateSum');
    component.setLimitsValues();
    expect(spy).toHaveBeenCalled();
  });

  it('method setCurrentLocation should be called', () => {
    const spy = spyOn<any>(component, 'setCurrentLocation');
    (component as any).setCurrentLocation('en');
    expect(spy).toHaveBeenCalled();
  });

  it('checkCourierLimit should check and set courierLimitByAmount', () => {
    mockLocations.courierLimit = 'LIMIT_BY_AMOUNT_OF_BAG';
    component.checkCourierLimit();
    fixture.detectChanges();
    expect(component.courierLimitByAmount).toBeTruthy();
  });

  it('validateBags should set courierLimitValidation', () => {
    component.courierLimitByAmount = true;
    component.validateBags();
    fixture.detectChanges();
    expect(component.courierLimitValidation).toBeFalsy();
  });

  it('validateSum should set courierLimitValidation', () => {
    component.courierLimitBySum = true;
    component.validateSum();
    fixture.detectChanges();
    expect(component.courierLimitValidation).toBeFalsy();
  });

  it('destroy should be closed after ngOnDestroy()', () => {
    (component as any).destroy = new Subject<boolean>();
    spyOn((component as any).destroy, 'next');
    component.ngOnDestroy();
    expect((component as any).destroy.next).toHaveBeenCalledTimes(1);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy = new Subject<boolean>();
    spyOn((component as any).destroy, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
