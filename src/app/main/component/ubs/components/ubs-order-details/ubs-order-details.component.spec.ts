import { RouterTestingModule } from '@angular/router/testing';
import { Language } from './../../../../i18n/Language';
import { LocalStorageService } from './../../../../service/localstorage/local-storage.service';
import { UBSOrderFormService } from './../../services/ubs-order-form.service';
import { LocalizedCurrencyPipe } from './../../../../../shared/localized-currency-pipe/localized-currency.pipe';
import { ICertificate, Bag, OrderDetails } from './../../models/ubs.interface';
import { OrderService } from './../../services/order.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UBSOrderDetailsComponent } from './ubs-order-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
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

  xit('method onQuantityChange should invoke calculateTotal method', () => {
    const bagsMock: Bag[] = [];
    const spy = spyOn<any>(component, 'calculateTotal');
    component.bags = bagsMock;
    fixture.detectChanges();
    component.onQuantityChange();
    expect(spy).toHaveBeenCalled();
  });

  it('method resetPoints should invoke methods', () => {
    const spy = spyOn(component, 'certificateReset');
    const spy1 = spyOn<any>(component, 'calculateTotal');
    Object.assign(component, { orders: { points: 0 } });
    fixture.detectChanges();
    component.resetPoints();
    expect(spy).toHaveBeenCalledWith(true);
    expect(spy1).toHaveBeenCalled();
  });

  it('method addOrder should invoke ecoStoreValidation method', () => {
    const spy = spyOn(component, 'ecoStoreValidation');
    spyOn(global, 'setTimeout');
    component.addOrder();
    expect(spy).toHaveBeenCalled();
  });

  it('method clearAdditionalCertificate should invoke methods', () => {
    const spy = spyOn(component, 'calculateCertificates').and.callFake(() => {});
    component.formArrayCertificates.push(new FormControl('0'));
    component.formArrayCertificates.push(new FormControl('1'));
    const spy1 = spyOn(component.formArrayCertificates, 'removeAt');
    const fakeIndex = 0;
    // @ts-ignore
    component.clearAdditionalCertificate(fakeIndex);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith(fakeIndex);
  });

  it('method deleteCertificate should invoke clearAdditionalCertificate method with correct index', () => {
    const spy = spyOn<any>(component, 'clearAdditionalCertificate');
    const fakeIndex = 0;
    component.deleteCertificate(fakeIndex);
    expect(spy).toHaveBeenCalledWith(fakeIndex);
  });

  it('method addedCertificateSubmit should invoke calculateCertificates method if there is some certificate doesn"t includes', () => {
    const spy = spyOn(component, 'calculateCertificates').and.callFake(() => {});
    const fakeIndex = 0;
    component.formArrayCertificates.value[fakeIndex] = 'fake';
    fixture.detectChanges();
    component.certificateSubmit(fakeIndex);
    expect(spy).toHaveBeenCalled();
  });

  it('method calculateCertificates should invoke calculateTotal method if arr.length=0', () => {
    const spy = spyOn<any>(component, 'calculateTotal');
    component.calculateCertificates([]);
    // @ts-ignore
    expect(component.calculateTotal).toHaveBeenCalled();
  });

  it('method calculateCertificates with arr.length>0 should asyncly invoke certificateMatch method', async(() => {
    const response: ICertificate = {
      certificatePoints: 0,
      certificateStatus: 'string'
    };
    const certificate = of(response);
    orderService = TestBed.inject(OrderService);
    const spy = spyOn(component, 'certificateMatch').and.callFake(() => {});
    spyOn<any>(component, 'calculateTotal').and.callFake(() => {});

    spyOn(orderService, 'processCertificate').and.returnValue(certificate);
    component.calculateCertificates([certificate]);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(component.certificateError).toBeFalsy();
  }));

  it('method orderService.processCertificate() with no args should asyncly return error', async(() => {
    orderService = TestBed.inject(OrderService);
    const errorResponse = new HttpErrorResponse({
      error: { code: 'some code', message: 'some message' },
      status: 404
    });
    const spy = spyOn(orderService, 'processCertificate').and.returnValue(throwError(errorResponse));
    spyOn<any>(component, 'calculateTotal').and.callFake(() => {});
    spyOn<any>(component, 'certificateError');
    fixture.detectChanges();
    component.calculateCertificates([0]);

    expect(component.certificateError).toBeTruthy();
  }));

  it('method certificateSubmit should invoke calculateCertificates method if there is some certificate doesn"t includes', () => {
    const spy = spyOn(component, 'calculateCertificates');
    component.orderDetailsForm.value.certificate = 'fake';
    fixture.detectChanges();
    component.certificateSubmit(1);
    expect(spy).toHaveBeenCalled();
  });

  it('function certificateReset should invoke calculateCertificates function', () => {
    const spy = spyOn(component, 'calculateCertificates');
    component.certificateReset(true);
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
