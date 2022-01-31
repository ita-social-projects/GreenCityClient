import { RouterTestingModule } from '@angular/router/testing';
import { Language } from '../../../../main/i18n/Language';
import { LocalStorageService } from '../../../../main/service/localstorage/local-storage.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { LocalizedCurrencyPipe } from '../../../../shared/localized-currency-pipe/localized-currency.pipe';
import { Bag, OrderDetails } from '../../models/ubs.interface';
import { OrderService } from '../../services/order.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
  shareFormService.locationId = 1;
  const localStorageService = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage', 'languageSubject', 'getUbsOrderData']);
  localStorageService.getUbsOrderData = () => null;
  localStorageService.languageSubject = fakeLanguageSubject;

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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSOrderDetailsComponent);
    component = fixture.componentInstance;
    spyOn(component, 'saveLocation');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('method calculateTotal should invoke methods', () => {
    const spy = spyOn(component, 'changeForm');
    const spy1 = spyOn(component, 'changeOrderDetails');
    const bagsMock: Bag[] = [];
    component.bags = bagsMock;
    fixture.detectChanges();
    // @ts-ignore
    component.calculateTotal();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('method clearOrderValues should invoke ecoStoreValidation method', () => {
    const spy = spyOn(component, 'ecoStoreValidation');
    component.clearOrderValues();
    expect(spy).toHaveBeenCalled();
  });

  it('method onQuantityChange should invoke calculateTotal method', () => {
    const bagsMock: Bag[] = [];
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

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
