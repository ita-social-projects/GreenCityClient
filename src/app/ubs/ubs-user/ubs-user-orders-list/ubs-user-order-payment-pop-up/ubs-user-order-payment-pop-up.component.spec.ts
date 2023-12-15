import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { IMaskModule } from 'angular-imask';
import { of, throwError } from 'rxjs';
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
  const bonusInfoFake = {
    left: 0,
    used: 0
  };
  const userCertificateFake = {
    certificateStatusActive: false,
    certificateError: false,
    creationDate: [],
    dateOfUse: [],
    expirationDate: [],
    certificateSum: 0,
    certificates: []
  };
  const fakeCertificates = {
    certificateStatus: 'ACTIVE',
    points: 222,
    creationDate: 'fake-Creation-Date',
    dateOfUse: 'fake-Use-Date',
    expirationDate: 'fake-Expiration-Date'
  };
  const fakeFondyResponse = {
    orderId: 11,
    link: 'fakeLink'
  };

  const fakeElement = document.createElement('div') as SafeHtml;
  const routerMock = jasmine.createSpyObj('router', ['navigate']);
  const sanitizerMock = jasmine.createSpyObj('sanitizer', ['bypassSecurityTrustHtml']);
  sanitizerMock.bypassSecurityTrustHtml.and.returnValue(fakeElement);
  const orderServiceMock = jasmine.createSpyObj('orderService', ['processCertificate', 'processOrderFondyFromUserOrderList']);
  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'setUbsFondyOrderId',
    'clearPaymentInfo',
    'setUserPagePayment'
  ]);
  const ubsOrderFormServiceMock = jasmine.createSpyObj('ubsOrderFormService', [
    'transferOrderId',
    'setOrderResponseErrorStatus',
    'setOrderStatus'
  ]);

  beforeEach(waitForAsync(() => {
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
        UntypedFormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserOrderPaymentPopUpComponent);
    component = fixture.componentInstance;
    component.bonusInfo = { ...bonusInfoFake };
    component.userCertificate = JSON.parse(JSON.stringify(userCertificateFake));
    fakeFondyResponse.link = 'fakeLink';
    orderServiceMock.processCertificate.and.returnValue(of(fakeCertificates));
    orderServiceMock.processOrderFondyFromUserOrderList.and.returnValue(of(fakeFondyResponse));
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
      expect(component.isUseBonuses).toBeFalsy();
      expect(component.certificateStatus).toEqual([true]);
    });
  });

  describe('initForm', () => {
    it('makes expected calls', () => {
      const initFormFake = {
        bonus: 'no',
        formArrayCertificates: [
          {
            certificateCode: null,
            certificateStatus: null,
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
      const certificate = { value: { certificateCode: '', certificateSum: 0 } };
      component.usedCertificates = ['1111-1111', '2222-2222'];
      component.userCertificate.certificates = [];
      const calculateCertificateSpy = spyOn(component, 'calculateCertificate');

      component.certificateSubmit(0, certificate as any);

      expect(calculateCertificateSpy).toHaveBeenCalledWith(certificate as any);
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
      expect(component.userCertificate.creationDate).toEqual(['Date.Creation.fake']);
      expect(component.userCertificate.expirationDate).toEqual(['Date.Expiration.fake']);
      expect(component.userCertificate.dateOfUse).toEqual(['Date.Use.fake']);
      expect(component.userOrder.sum).toBe(555);
      expect(component.userCertificate.certificateStatusActive).toBeTruthy();
    });

    it('makes expected calls when userOrder.sum - certificateSum < 0', () => {
      const certificate = { value: { certificateCode: 3 } };
      component.userOrder.sum = 111;

      component.calculateCertificate(certificate as any);

      expect(component.userCertificate.certificateSum).toBe(222);
      expect(component.userCertificate.creationDate).toEqual(['Date.Creation.fake']);
      expect(component.userCertificate.expirationDate).toEqual(['Date.Expiration.fake']);
      expect(component.userCertificate.dateOfUse).toEqual(['Date.Use.fake']);
      expect(component.userOrder.sum).toBe(0);
      expect(component.userCertificate.certificateStatusActive).toBeTruthy();
    });

    it('makes expected calls when certificateStatus !== "ACTIVE"', () => {
      const certificate = { value: { certificateCode: 3 } };
      orderServiceMock.processCertificate.and.returnValue(
        of({
          certificateStatus: 'FAKE',
          creationDate: 'fake-Creation-Date',
          expirationDate: 'fake-Expiration-Date',
          dateOfUse: 'fake-Use-Date'
        })
      );

      component.calculateCertificate(certificate as any);

      expect(component.userCertificate.certificateError).toBeTruthy();
      expect(component.userCertificate.creationDate).toEqual(['Date.Creation.fake']);
      expect(component.userCertificate.expirationDate).toEqual(['Date.Expiration.fake']);
      expect(component.userCertificate.dateOfUse).toEqual(['Date.Use.fake']);
    });

    it('makes expected calls when throws error', () => {
      const certificate = { value: { certificateCode: 3 } };
      const errorResponse = new HttpErrorResponse({
        status: 404
      });
      orderServiceMock.processCertificate.and.returnValue(throwError(errorResponse));

      component.calculateCertificate(certificate as any);

      expect(component.userCertificate.certificateError).toBeTruthy();
      expect(component.userCertificate.creationDate).toEqual([null]);
      expect(component.userCertificate.expirationDate).toEqual([null]);
      expect(component.userCertificate.dateOfUse).toEqual([null]);
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

  describe('processOrder', () => {
    it('makes expected calls for Fondy with link', () => {
      const fillOrderClientDtoSpy = spyOn(component, 'fillOrderClientDto');
      const redirectToExternalUrlSpy = spyOn(component as any, 'redirectToExternalUrl');
      component.orderDetailsForm.controls.paymentSystem.setValue('Fondy');

      component.processOrder();

      expect(fillOrderClientDtoSpy).toHaveBeenCalled();
      expect(localStorageServiceMock.clearPaymentInfo).toHaveBeenCalled();
      expect(localStorageServiceMock.setUserPagePayment).toHaveBeenCalledWith(true);
      expect(redirectToExternalUrlSpy).toHaveBeenCalledWith('fakeLink');
      expect(localStorageServiceMock.setUbsFondyOrderId).toHaveBeenCalled();
    });

    it('makes expected calls for Fondy without link', () => {
      fakeFondyResponse.link = null;
      const fillOrderClientDtoSpy = spyOn(component, 'fillOrderClientDto');
      const redirectionToConfirmPageSpy = spyOn(component, 'redirectionToConfirmPage');
      component.orderDetailsForm.controls.paymentSystem.setValue('Fondy');

      component.processOrder();

      expect(fillOrderClientDtoSpy).toHaveBeenCalled();
      expect(localStorageServiceMock.clearPaymentInfo).toHaveBeenCalled();
      expect(localStorageServiceMock.setUserPagePayment).toHaveBeenCalledWith(true);
      expect(redirectionToConfirmPageSpy).toHaveBeenCalled();
      expect(matDialogRefMock.close).toHaveBeenCalled();
    });

    it('makes expected calls for Fondy with error', () => {
      orderServiceMock.processOrderFondyFromUserOrderList.and.returnValue(throwError(new Error('oops!')));
      const fillOrderClientDtoSpy = spyOn(component, 'fillOrderClientDto');
      component.orderDetailsForm.controls.paymentSystem.setValue('Fondy');

      component.processOrder();

      expect(fillOrderClientDtoSpy).toHaveBeenCalled();
      expect(localStorageServiceMock.clearPaymentInfo).toHaveBeenCalled();
      expect(localStorageServiceMock.setUserPagePayment).toHaveBeenCalledWith(true);
    });

    describe('bonusOption', () => {
      it('makes expected calls if value is "yes" and sum is more than bonusValue', () => {
        const event = { value: 'yes' } as any;

        component.bonusOption(event);

        expect(component.userOrder.sum).toBe(444);
        expect(component.bonusInfo.used).toBe(333);
        expect(component.orderClientDto.pointsToUse).toBe(333);
      });

      it('makes expected calls if value is "yes" and sum is not more than bonusValue', () => {
        const event = { value: 'yes' } as any;
        component.userOrder.bonusValue = 1000;

        component.bonusOption(event);

        expect(component.userOrder.sum).toBe(0);
        expect(component.bonusInfo.used).toBe(777);
        expect(component.orderClientDto.pointsToUse).toBe(777);
        expect(component.bonusInfo.left).toBe(223);
      });

      it('makes expected calls if value is not "yes"', () => {
        const event = { value: 'no' } as any;

        component.bonusOption(event);

        expect(component.userOrder.sum).toBe(777);
        expect(component.bonusInfo.used).toBe(0);
        expect(component.bonusInfo.left).toBe(0);
        expect(component.isUseBonuses).toBeFalsy();
      });
    });

    describe('deleteCertificate', () => {
      it('makes expected calls if certificates are more than one', () => {
        const certificate = { value: { certificateSum: 111 } };
        const formArrayCertificatesFake = new UntypedFormArray([
          new UntypedFormGroup({
            certificateCode: new UntypedFormControl('fakeCode 1'),
            certificateStatus: new UntypedFormControl('ACTIVE'),
            certificateSum: new UntypedFormControl(0)
          }),
          new UntypedFormGroup({
            certificateCode: new UntypedFormControl('fakeCode 2'),
            certificateStatus: new UntypedFormControl('ACTIVE'),
            certificateSum: new UntypedFormControl(100)
          })
        ]);
        component.bonusInfo.used = 0;
        component.userOrder.sum = 666;
        component.formBonus.setValue('no');
        component.userCertificate.certificates = formArrayCertificatesFake.value;
        component.orderDetailsForm.controls.formArrayCertificates = formArrayCertificatesFake;
        component.certificateStatus = [true, true];

        component.deleteCertificate(0, certificate as any);

        expect(component.userOrder.sum).toBe(777);
        expect(component.bonusInfo.used).toBe(0);
        expect(component.bonusInfo.left).toBe(0);
        expect(component.overpayment).toBe(0);
        expect(component.userCertificate.certificateStatusActive).toBeTruthy();
        expect(component.userCertificate.certificateError).toBeFalsy();
        expect(component.certificateStatus).toEqual([true]);
        expect(component.formArrayCertificates.value).toEqual([
          {
            certificateCode: 'fakeCode 2',
            certificateStatus: 'ACTIVE',
            certificateSum: 100
          }
        ]);
        expect(component.userCertificate.certificates).toEqual([
          {
            certificateCode: 'fakeCode 2',
            certificateStatus: 'ACTIVE',
            certificateSum: 100
          }
        ]);
      });

      it('makes expected calls if certificates are no more than one', () => {
        const certificate = { value: { certificateSum: 111 } };
        const formArrayCertificatesFake = new UntypedFormArray([
          new UntypedFormGroup({
            certificateCode: new UntypedFormControl('fakeCode 1'),
            certificateStatus: new UntypedFormControl('ACTIVE'),
            certificateSum: new UntypedFormControl(111)
          })
        ]);
        component.formBonus.setValue('yes');
        component.bonusInfo.left = 111;
        component.userCertificate.certificates = formArrayCertificatesFake.value;
        component.orderDetailsForm.controls.formArrayCertificates = formArrayCertificatesFake;

        component.deleteCertificate(0, certificate as any);

        expect(component.userOrder.sum).toBe(777);
        expect(component.bonusInfo.used).toBe(111);
        expect(component.bonusInfo.left).toBe(0);
        expect(component.overpayment).toBe(0);
        expect(component.userCertificate.certificateStatusActive).toBeFalsy();
        expect(component.userCertificate.certificateError).toBeFalsy();
        expect(component.certificateStatus).toEqual([true]);
        expect(component.formArrayCertificates.value).toEqual([
          {
            certificateCode: null,
            certificateStatus: null,
            certificateSum: null
          }
        ]);
        expect(component.userCertificate.certificates).toEqual([]);
      });
    });

    describe('addNewCertificate', () => {
      it('makes expected calls', () => {
        const formArrayCertificatesFake = new UntypedFormArray([
          new UntypedFormGroup({
            certificateCode: new UntypedFormControl(''),
            certificateStatus: new UntypedFormControl(''),
            certificateSum: new UntypedFormControl(0)
          })
        ]);
        component.orderDetailsForm.controls.formArrayCertificates = formArrayCertificatesFake;
        component.certificateStatus = [true];

        component.addNewCertificate();

        expect(component.formArrayCertificates.value).toEqual([
          {
            certificateCode: '',
            certificateStatus: '',
            certificateSum: 0
          },
          {
            certificateCode: null,
            certificateStatus: null,
            certificateSum: 0
          }
        ]);
        expect(component.userCertificate.certificateStatusActive).toBeFalsy();
        expect(component.certificateStatus).toEqual([true, true]);
      });
    });

    describe('fillOrderClientDto', () => {
      it('makes expected calls if there is no certificate', () => {
        component.userCertificate.certificates = [];
        component.orderClientDto.certificates = ['fakeCertificate 1', 'fakeCertificate 2', 'fakeCertificate 3'];

        component.fillOrderClientDto();

        expect(component.orderClientDto.orderId).toBe(123);
        expect(component.orderClientDto.certificates.length).toBe(3);
      });

      it('makes expected calls if there are certificates', () => {
        component.userCertificate.certificates = [{ certificateCode: '1' }, { certificateCode: '2' }] as any;

        component.fillOrderClientDto();

        expect(component.orderClientDto.orderId).toBe(123);
        expect(component.orderClientDto.certificates.length).toBe(2);
        expect(component.orderClientDto.certificates).toEqual(['1', '2']);
      });
    });
  });
});
