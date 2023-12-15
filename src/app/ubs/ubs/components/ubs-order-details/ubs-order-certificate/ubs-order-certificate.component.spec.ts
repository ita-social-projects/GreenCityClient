import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';
import { UbsOrderCertificateComponent } from './ubs-order-certificate.component';
import { UntypedFormControl, FormsModule, ReactiveFormsModule, UntypedFormArray } from '@angular/forms';
import { ICertificateResponse, Certificate } from '../../../models/ubs.interface';
import { of, throwError } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalizedCurrencyPipe } from '../../../../../shared/localized-currency-pipe/localized-currency.pipe';
import { UbsOrderLocationPopupComponent } from '../ubs-order-location-popup/ubs-order-location-popup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UBSOrderFormService } from '../../../services/ubs-order-form.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IMaskModule } from 'angular-imask';
import { Store } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';

describe('UbsOrderCertificateComponent', () => {
  let component: UbsOrderCertificateComponent;
  let fixture: ComponentFixture<UbsOrderCertificateComponent>;
  let orderService: OrderService;
  const shareFormService = jasmine.createSpyObj('shareFormService', [
    'orderDetails',
    'changeAddCertButtonVisibility',
    'addCert',
    'changeOrderDetails'
  ]);
  shareFormService.addCert = of(false);
  const mockedCert: Certificate = {
    codes: ['8888 - 8888'],
    points: [500],
    activatedStatus: [true],
    creationDates: ['18.12.2022'],
    dateOfUses: ['underfined'],
    expirationDates: ['19.12.2022'],
    failed: [false],
    status: ['ACTIVE'],
    error: [false]
  };

  const localStorageService = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage', 'languageSubject', 'getUbsOrderData']);

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
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
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: Store, useValue: storeMock }
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

  it('method deleteCertificate should invoke method calculateCertificates', () => {
    const spy = spyOn(component, 'calculateCertificates').and.callFake(() => {});
    component.formArrayCertificates.push(new UntypedFormControl('1111-1111'));
    component.formArrayCertificates.push(new UntypedFormControl('2222-2222'));
    const spy1 = spyOn(component.formArrayCertificates, 'removeAt');
    const fakeIndex = 0;
    component.certificates = mockedCert;
    (component as any).deleteCertificate(fakeIndex);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith(fakeIndex);
    expect(component.certificates.creationDates).toEqual([]);
    expect(component.certificates.dateOfUses).toEqual([]);
    expect(component.certificates.expirationDates).toEqual([]);
    expect(component.calculateCertificates).toHaveBeenCalled();
  });

  it('method calculateTotal should invoke method changeOrderDetails', () => {
    const spy = spyOn(component, 'changeOrderDetails');
    component.bags = [];
    fixture.detectChanges();
    (component as any).calculateTotal();
    expect(spy).toHaveBeenCalled();
  });

  it('method calculateTotal should set showTotal and certificateLeft', () => {
    component.certificateSum = 700;
    component.total = 1000;
    component.bags = [];
    fixture.detectChanges();
    (component as any).calculateTotal();
    expect(component.showTotal).toEqual(component.total);
  });

  it('method calculateTotal should set 0 to certificateLeft if certificateSum <= 0', () => {
    component.certificateSum = 0;
    component.total = 300;
    component.bags = [];
    fixture.detectChanges();
    (component as any).calculateTotal();
    expect(component.certificateLeft).toEqual(0);
  });

  it('particalResetStoragedCertificates methor should reset several items in certificates', () => {
    component.certificates = mockedCert;
    component.particalResetStoragedCertificates();
    expect(component.certificates.dateOfUses).toEqual([]);
    expect(component.certificates.creationDates).toEqual([]);
    expect(component.certificates.expirationDates).toEqual([]);
    expect(component.certificates.points).toEqual([]);
    expect(component.certificates.failed).toEqual([]);
    expect(component.certificates.status).toEqual([]);
  });

  it('certificateSubmit should set some variables', () => {
    component.formArrayCertificates.value[0] = '9999-9999';
    (component as any).certificateSubmit(0);
    expect(component.certificates.codes).toContain('9999-9999');
    expect(component.certificates.activatedStatus).toContain(true);
    expect(component.certificates.error).toContain(false);
  });

  it('certificateSubmit should invoke methods particalResetStoragedCertificates and calculateCertificates', () => {
    component.certificates.codes = ['9999-9999'];
    component.formArrayCertificates.value[0] = '9999-9999';
    const spy = spyOn(component, 'particalResetStoragedCertificates').and.callThrough();
    const spy1 = spyOn(component, 'calculateCertificates').and.callThrough();
    (component as any).certificateSubmit(0);
    expect(spy).not.toHaveBeenCalled();
    expect(spy1).not.toHaveBeenCalled();
  });

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

  it('method calculateCertificates with arr.length>0 should asyncly invoke certificateMatch method', waitForAsync(() => {
    const response: ICertificateResponse = {
      points: 0,
      certificateStatus: 'string'
    };
    component.certificates = mockedCert;
    const certificate = of(response);
    orderService = TestBed.inject(OrderService);
    spyOn(component, 'certificateMatch').and.callFake(() => {});
    expect(component.displayCert).toBe(false);
    expect(component.shareFormService.changeAddCertButtonVisibility).toBeTruthy();
    const spy = spyOn<any>(component, 'calculateTotal').and.callFake(() => {});
    spyOn(orderService, 'processCertificate').and.returnValue(certificate);
    component.calculateCertificates();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('certificateMatch method should invoke changeAddCertButtonVisibility if status is ACTIVE', waitForAsync(() => {
    const cert: ICertificateResponse = {
      points: 100,
      certificateStatus: 'ACTIVE',
      code: '9999-9999'
    };
    component.certificateMatch(cert);

    expect(component.displayCert).toBe(true);
    expect(component.shareFormService.changeAddCertButtonVisibility).toHaveBeenCalledWith(true);
    expect(component.certificateSum).toEqual(100);
  }));

  it('method orderService.processCertificate() with no args should asyncly return error', waitForAsync(() => {
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

  it('disableAddCertificate should return false if certificates.codes.length doesn"t equal formArrayCertificates.length', () => {
    const result = component.disableAddCertificate();
    expect(result).toBe(false);
  });

  it('disableAddCertificate should return true if certificates.codes.length equals formArrayCertificates.length', () => {
    component.certificates.codes = ['1111-1111'];
    const result = component.disableAddCertificate();
    expect(result).toBe(true);
  });

  it('function certificateReset should invoke calculateCertificates function', () => {
    const patchValueSpy = spyOn(component.formArrayCertificates, 'patchValue');
    const markAsUntouchedSpy = spyOn(component.formArrayCertificates, 'markAsUntouched');
    component.certificateReset();
    for (const key of Object.keys(component.certificates)) {
      expect(component.certificates[key]).toEqual([]);
    }
    expect(component.certSize).toBeFalsy();
    expect(component.certificateLeft).toEqual(0);
    expect(component.certificateSum).toEqual(0);
    expect(component.fullCertificate).toEqual(0);
    expect(component.shareFormService.changeAddCertButtonVisibility).toHaveBeenCalledWith(false);
    expect(patchValueSpy).toHaveBeenCalledWith(['']);
    expect(markAsUntouchedSpy).toHaveBeenCalled();
    expect(component.clickOnYes).toBe(true);
    expect(component.bonusesRemaining).toBe(false);
    expect(component.displayCert).toBe(false);
  });

  it('getter formArrayCertificates should return formArray', () => {
    const formArray = component.orderDetailsForm.controls.formArrayCertificates as UntypedFormArray;
    const spy = spyOnProperty(component, 'formArrayCertificates').and.returnValue(formArray);
    expect(component.formArrayCertificates).toBe(formArray);
    expect(spy).toHaveBeenCalled();
  });

  it('deleteCertificate should delete certificate from array and invoke some methods', () => {
    const spy = spyOn(component, 'calculateCertificates');
    const spy1 = spyOn(component, 'certificateReset');
    component.certificates.codes = ['8888-8888'];
    component.bags = [];
    component.deleteCertificate(0);
    for (const key of Object.keys(component.certificates)) {
      expect(component.certificates[key]).toEqual([]);
    }
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('showCancelButton should return true if activatedStatus true', () => {
    component.certificates.activatedStatus = [true];
    component.formArrayCertificates.controls.push(new UntypedFormControl('1111-1111'));

    const result = component.showCancelButton(0);
    expect(result).toBe(true);
  });

  it('showCancelButton should return false if there is no active certificates and value in input', () => {
    const result = component.showCancelButton(0);
    expect(result).toBe(false);
  });

  it('resetPoints should invoke method sendDataToParents if clickOnNo is true', () => {
    component.clickOnNo = true;
    component.certificateSum = 700;
    component.showTotal = 1000;
    const spy = spyOn(component, 'sendDataToParents');
    component.resetPoints();
    expect(component.pointsUsed).toEqual(0);
    expect(spy).toHaveBeenCalled();
    expect(component.clickOnNo).toBe(false);
  });

  it('sendDataToParents should invoke setNewValue with arg', () => {
    const certificateObj = {
      certificates: [],
      showCertificateUsed: 0,
      certificateSum: undefined,
      displayCert: false,
      finalSum: 0,
      pointsUsed: undefined,
      points: undefined,
      isBonus: 'no'
    };
    const spy = spyOn(component, 'setNewValue');
    component.sendDataToParents();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(certificateObj);
  });

  it('calculatePoints method should invoke sendDataToParents and set some variables', () => {
    component.certificateSum = 0;
    component.clickOnYes = true;
    component.showTotal = 100;
    const spy = spyOn(component, 'sendDataToParents');
    component.calculatePoints();
    expect(component.fullCertificate).toEqual(0);
    expect(component.clickOnYes).toBe(false);
    expect(spy).toHaveBeenCalled();
  });

  it('calculatePointsWithCertificate', () => {
    const totalSumIsBiggerThanPoints = 1;
    component.showTotal = 0;
    const result = component.calculatePointsWithCertificate();
    expect(result).toBeFalsy();
  });

  it('certificateSubmit should invoke particalResetStoragedCertificates', () => {
    component.certificates.codes = ['7777-7777', '8888-8888'];
    const spy = spyOn(component, 'particalResetStoragedCertificates');
    component.certificateSubmit(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should cancel streams after ngOnDestroy', () => {
    const nextSpy = spyOn(component.destroy, 'next');
    const completeSpy = spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should return false if certificate is already activated', () => {
    component.certificates = mockedCert;
    component.certificates.activatedStatus = [true];
    component.formArrayCertificates.push(new UntypedFormControl('1111-1111'));
    const result = component.showActivateButton(0);

    expect(result).toBe(false);
  });

  it('should return false if form is not filled', () => {
    component.formArrayCertificates.push(new UntypedFormControl(''));
    const result = component.showActivateButton(0);

    expect(result).toBe(false);
  });

  it('should return false if button is disabled', () => {
    spyOn(component, 'disableAddCertificate').and.returnValue(true);
    component.formArrayCertificates.push(new UntypedFormControl('1111-1111'));
    const result = component.showActivateButton(0);

    expect(result).toBe(false);
  });

  it('should return false if multiple certificates are present', () => {
    component.formArrayCertificates.push(new UntypedFormControl('1111-1111'));
    component.formArrayCertificates.push(new UntypedFormControl('1111-2222'));
    const result = component.showActivateButton(0);

    expect(result).toBe(false);
  });

  it('should return false if certificate is already entered', () => {
    spyOn(component, 'showMessageForAlreadyEnteredCert').and.returnValue(true);
    component.certificates = mockedCert;
    component.formArrayCertificates.push(new UntypedFormControl('1111-1111'));
    const result = component.showActivateButton(0);

    expect(result).toBe(false);
  });

  it('should return false if certificate is not already entered', () => {
    component.certificates = mockedCert;
    component.formArrayCertificates.push(new UntypedFormControl('1111-1111'));
    component.alreadyEnteredCert = [];
    const result = component.showMessageForAlreadyEnteredCert(0);

    expect(result).toBe(false);
  });

  it('should return false if there are multiple certificates already entered', () => {
    component.certificates = mockedCert;
    component.formArrayCertificates.push(new UntypedFormControl('1111-1111'));
    component.alreadyEnteredCert = ['1111-1111', '1111-1122'];
    const result = component.showMessageForAlreadyEnteredCert(0);

    expect(result).toBe(false);
  });
});
