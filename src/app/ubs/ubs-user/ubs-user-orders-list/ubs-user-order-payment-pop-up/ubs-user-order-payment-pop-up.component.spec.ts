import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';
import { of } from 'rxjs';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { UBSOrderFormService } from 'src/app/ubs/ubs/services/ubs-order-form.service';

import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up.component';

describe('UbsUserOrderPaymentPopUpComponent', () => {
  let component: UbsUserOrderPaymentPopUpComponent;
  let fixture: ComponentFixture<UbsUserOrderPaymentPopUpComponent>;

  const matDialogRefMock = jasmine.createSpyObj('dialogRef', ['close']);
  const mockedData = {
    orderId: 123,
    price: 777,
    bonuses: 333
  };
  const fakeCertificates = {
    certificateStatus: 'ACTIVE',
    certificatePoints: 222,
    certificateDate: 'fakeDate'
  };
  const fakeFondyResponse = {
    orderId: 11,
    link: 'fakeLink'
  };
  const fakeLiqPayResponse = {
    orderId: 22,
    link: 'fakeLiqPayButton'
  };
  const fakeElement = document.createElement('div') as SafeHtml;
  const routerMock = jasmine.createSpyObj('router', ['navigate']);
  const sanitizerMock = jasmine.createSpyObj('sanitizer', ['bypassSecurityTrustHtml']);
  sanitizerMock.bypassSecurityTrustHtml.and.returnValue(fakeElement);
  const orderServiceMock = jasmine.createSpyObj('orderService', [
    'processCertificate',
    'processOrderFondyFromUserOrderList',
    'processOrderLiqPayFromUserOrderList'
  ]);
  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'setUbsOrderId',
    'setUbsFondyOrderId',
    'clearPaymentInfo',
    'setUserPagePayment'
  ]);
  const ubsOrderFormServiceMock = jasmine.createSpyObj('ubsOrderFormService', [
    'transferOrderId',
    'setOrderResponseErrorStatus',
    'setOrderStatus'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrderPaymentPopUpComponent],
      imports: [FormsModule, ReactiveFormsModule, MatRadioModule, IMaskModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: UBSOrderFormService, useValue: ubsOrderFormServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: DomSanitizer, useValue: sanitizerMock },
        { provide: Router, useValue: routerMock },
        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserOrderPaymentPopUpComponent);
    component = fixture.componentInstance;
    orderServiceMock.processCertificate.and.returnValue(of(fakeCertificates));
    orderServiceMock.processOrderFondyFromUserOrderList.and.returnValue(of(fakeFondyResponse));
    orderServiceMock.processOrderLiqPayFromUserOrderList.and.returnValue(of(fakeLiqPayResponse));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const spyInitForm = spyOn(component, 'initForm');
      spyInitForm.and.callFake(() => {
        component.certificateStatus = [];
      });
      component.ngOnInit();
      expect(spyInitForm).toHaveBeenCalled();
      expect(component.isLiqPayLink).toBeFalsy();
      expect(component.isUseBonuses).toBeFalsy();
      expect(component.dataLoadingLiqPay).toBeFalsy();
      expect(component.certificateStatus).toEqual([true]);
    });
  });

  describe('initForm', () => {
    it('makes expected calls', () => {
      const initFormFake = {
        bonus: 'no',
        formArrayCertificates: [
          {
            certificateCode: '',
            certificateSum: 0
          }
        ],
        paymentSystem: 'Fondy'
      };
      component.initForm();
      expect(component.orderDetailsForm.value).toEqual(initFormFake);
    });
  });

  describe('certificateSubmit', () => {
    it('makes expected calls', () => {
      component.userCertificate.certificates = [];
      const calculateCertificateSpy = spyOn(component, 'calculateCertificate');
      component.certificateSubmit(0, {} as any);
      expect(calculateCertificateSpy).toHaveBeenCalledWith({});
      expect(component.userCertificate.certificates).toEqual([
        {
          certificateCode: '',
          certificateSum: 0
        }
      ]);
      expect(component.certificateStatus[0]).toBeFalsy();
    });
  });

  describe('calculateCertificate', () => {
    it('makes expected calls when userOrder.sum - certificateSum >= 0 ', () => {
      const certificate = { value: { certificateCode: 3 } };
      component.calculateCertificate(certificate as any);
      expect(component.userCertificate.certificateSum).toBe(222);
      expect(component.userCertificate.certificateDate).toBe('fakeDate');
      expect(component.userOrder.sum).toBe(555);
      expect(component.userCertificate.certificateStatusActive).toBeTruthy();
    });

    it('makes expected calls when userOrder.sum - certificateSum < 0', () => {
      const certificate = { value: { certificateCode: 3 } };
      component.userOrder.sum = 111;
      component.calculateCertificate(certificate as any);
      expect(component.userCertificate.certificateSum).toBe(222);
      expect(component.userCertificate.certificateDate).toBe('fakeDate');
      expect(component.userOrder.sum).toBe(0);
      expect(component.userCertificate.certificateStatusActive).toBeTruthy();
    });

    it('makes expected calls when certificateStatus !== "ACTIVE"', () => {
      const certificate = { value: { certificateCode: 3 } };
      orderServiceMock.processCertificate.and.returnValue(of({ certificateStatus: 'FAKE' }));
      component.calculateCertificate(certificate as any);
      expect(component.userCertificate.certificateError).toBeTruthy();
    });
  });

  describe('formOrderWithoutPaymentSystems', () => {
    it('makes expected calls', () => {
      component.formOrderWithoutPaymentSystems(0);
      expect(ubsOrderFormServiceMock.transferOrderId).toHaveBeenCalledWith(0);
      expect(ubsOrderFormServiceMock.setOrderResponseErrorStatus).toHaveBeenCalledWith(false);
      expect(ubsOrderFormServiceMock.setOrderStatus).toHaveBeenCalledWith(true);
    });
  });

  describe('redirectionToConfirmPage', () => {
    it('makes expected calls', () => {
      const formOrderWithoutPaymentSystemsSpy = spyOn(component, 'formOrderWithoutPaymentSystems');
      component.redirectionToConfirmPage();
      expect(formOrderWithoutPaymentSystemsSpy).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['ubs', 'confirm']);
    });
  });

  describe('orderOptionPayment', () => {
    it('makes expected calls', () => {
      const event = { target: { value: 'fakeValue' } } as any;
      const fillOrderClientDtoSpy = spyOn(component, 'fillOrderClientDto');
      component.orderOptionPayment(event);
      expect(fillOrderClientDtoSpy).toHaveBeenCalled();
      expect(component.selectedPayment).toBe('fakeValue');
    });
  });
});
