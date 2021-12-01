import { RouterTestingModule } from '@angular/router/testing';
import { Language } from './../../../../i18n/Language';
import { LocalStorageService } from './../../../../service/localstorage/local-storage.service';
import { UBSOrderFormService } from './../../services/ubs-order-form.service';
import { LocalizedCurrencyPipe } from './../../../../../shared/localized-currency-pipe/localized-currency.pipe';
import { Bag, OrderDetails } from './../../models/ubs.interface';
import { OrderService } from './../../services/order.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSOrderDetailsComponent } from './ubs-order-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup/ubs-order-location-popup.component';

describe('OrderDetailsFormComponent', () => {
  let component: UBSOrderDetailsComponent;
  let fixture: ComponentFixture<UBSOrderDetailsComponent>;
  let orderService: OrderService;
  const fakeLanguageSubject: Subject<string> = new Subject<string>();
  const shareFormService = jasmine.createSpyObj('shareFormService', ['orderDetails']);
  const localStorageService = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage', 'languageSubject']);

  localStorageService.languageSubject = fakeLanguageSubject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UBSOrderDetailsComponent, LocalizedCurrencyPipe, UbsOrderLocationPopupComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: UBSOrderFormService, useValue: shareFormService },
        { provide: LocalStorageService, useValue: localStorageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method takeOrderData should invoke localStorageService.getCurrentLanguage method', async(() => {
    const mock: OrderDetails = {
      bags: [{ id: 0, code: 'ua' }],
      points: 0
    };
    orderService = TestBed.inject(OrderService);
    const spy = spyOn(orderService, 'getOrders').and.returnValue(of(mock));
    shareFormService.orderDetails = mock;
    localStorageService.getCurrentLanguage.and.callFake(() => Language.UA);
    fixture.detectChanges();
    component.takeOrderData();
    expect(component.currentLanguage).toBe('ua');
    expect(spy).toHaveBeenCalled();
    expect(component.bags).toEqual(component.orders.bags);
  }));

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
