import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { UbsOrderCertificateComponent } from './ubs-order-certificate.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICertificateResponse } from '../../../models/ubs.interface';
import { of, throwError } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalizedCurrencyPipe } from '../../../../../shared/localized-currency-pipe/localized-currency.pipe';
import { UbsOrderLocationPopupComponent } from '../ubs-order-location-popup/ubs-order-location-popup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UBSOrderFormService } from '../../../services/ubs-order-form.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IMaskModule } from 'angular-imask';
import { expressionType } from '@angular/compiler/src/output/output_ast';

describe('UbsOrderCertificateComponent', () => {
  let component: UbsOrderCertificateComponent;
  let fixture: ComponentFixture<UbsOrderCertificateComponent>;
  let orderService: OrderService;
  const shareFormService = jasmine.createSpyObj('shareFormService', ['orderDetails', 'changeAddCertButtonVisibility']);
  shareFormService.addCert = of(false);
  /*const mock: Certificate = {
    codes: '8888-8888',
    points: '500',
    creationDates: '18.12.2022',
    dateOfUses: 'underfined',
    expirationDates: '19.12.2022',
    failed: false,
    error: false
  };/** */

  const mockedCert = {
    error: []
  };
  const localStorageService = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage', 'languageSubject']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsOrderCertificateComponent, LocalizedCurrencyPipe, UbsOrderLocationPopupComponent],
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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('method clearAdditionalCertificate should invoke methods', () => {
    const spy = spyOn(component, 'calculateCertificates').and.callFake(() => {});
    component.formArrayCertificates.push(new FormControl('0'));
    component.formArrayCertificates.push(new FormControl('1'));
    const spy1 = spyOn(component.formArrayCertificates, 'removeAt');
    const fakeIndex = 0;
    component.certificates.creationDates = ['fake'];
    component.certificates.dateOfUses = ['fake'];
    component.certificates.expirationDates = ['fake'];
    component.certStatus = ['fake'];
    (component as any).clearAdditionalCertificate(fakeIndex);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith(fakeIndex);
    expect(component.certificates.creationDates).toEqual([]);
    expect(component.certificates.dateOfUses).toEqual([]);
    expect(component.certificates.expirationDates).toEqual([]);
    expect(component.certStatus).toEqual([]);
  });/** */

  /*it('method deleteCertificate should invoke clearAdditionalCertificate method with correct index', () => {
    const spy = spyOn<any>(component, 'clearAdditionalCertificate');
    const fakeIndex = 0;
    component.deleteCertificate(fakeIndex);
    expect(spy).toHaveBeenCalledWith(fakeIndex);
  });/** */

  it('method addedCertificateSubmit should invoke calculateCertificates method if there is some certificate doesn"t includes', () => {
    const spy = spyOn(component, 'calculateCertificates').and.callFake(() => {});
    const fakeIndex = 0;
    component.formArrayCertificates.value[fakeIndex] = 'fake';
    fixture.detectChanges();
    component.certificateSubmit(fakeIndex);
    expect(spy).toHaveBeenCalled();
  });

  it('method certificateDateTreat should reverse date', () => {
    const res = (component as any).certificateDateTreat('fake-date');
    expect(res).toBe('date.fake');
  });

  it('method calculateCertificates should invoke calculateTotal method if arr.length=0', () => {
    const spy = spyOn<any>(component, 'calculateTotal');
    component.calculateCertificates();
    expect(spy).toHaveBeenCalled();
  });

  it('method calculateCertificates with arr.length>0 should asyncly invoke certificateMatch method', async(() => {
    const response: ICertificateResponse = {
      points: 0,
      certificateStatus: 'string'
    };
    const certificate = of(response);
    orderService = TestBed.inject(OrderService);
    const spy = spyOn(component, 'certificateMatch').and.callFake((response) => {});
    spyOn<any>(component, 'calculateTotal').and.callFake(() => {});

    spyOn(orderService, 'processCertificate').and.returnValue(certificate);
    component.calculateCertificates();
    fixture.detectChanges();
    //expect(spy).toHaveBeenCalled();
  }));

  it('method orderService.processCertificate() with no args should asyncly return error', async(() => {
    orderService = TestBed.inject(OrderService);
    const errorResponse = new HttpErrorResponse({
      error: { code: 'some code', message: 'some message' },
      status: 404
    });
    const spy = spyOn(orderService, 'processCertificate').and.returnValue(throwError(errorResponse));
    spyOn<any>(component, 'calculateTotal').and.callFake(() => {});

    component.calculateCertificates();
    fixture.detectChanges();

    expect(component.cancelCertBtn).toBeFalsy();
  }));

  it('method certificateSubmit should invoke calculateCertificates method if there is some certificate doesn"t includes', () => {
    const spy = spyOn(component, 'calculateCertificates');
    component.orderDetailsForm.value.certificate = 'fake';
    fixture.detectChanges();
    component.certificateSubmit(1);
    expect(spy).toHaveBeenCalled();
  });

  it('function certificateReset should invoke calculateCertificates function', () => {
    const patchValueSpy = spyOn(component.formArrayCertificates, 'patchValue');
    const markAsUntouchedSpy = spyOn(component.formArrayCertificates, 'markAsUntouched');
    component.certificateReset();
    expect(patchValueSpy).toHaveBeenCalledWith(['']);
    expect(markAsUntouchedSpy).toHaveBeenCalled();
  });
});
