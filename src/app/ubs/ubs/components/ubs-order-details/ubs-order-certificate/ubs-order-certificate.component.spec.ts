import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UbsOrderCertificateComponent } from './ubs-order-certificate.component';
import { OrderService } from '../../../services/order.service';
import { GetUserBonuses } from 'src/app/store/actions/ubs-user.actions';
import { TranslateModule } from '@ngx-translate/core';

const orderServiceMock = {
  processCertificate: jasmine.createSpy('processCertificate')
};

const storeMock = {
  dispatch: jasmine.createSpy('dispatch'),
  pipe: jasmine.createSpy('pipe').and.returnValue(of()),
  select: jasmine.createSpy('select').and.returnValue(of())
};

describe('UbsOrderCertificateComponent (Partial Tests)', () => {
  let component: UbsOrderCertificateComponent;
  let fixture: ComponentFixture<UbsOrderCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UbsOrderCertificateComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: OrderService, useValue: orderServiceMock },
        {
          provide: Store,
          useValue: storeMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderCertificateComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit()', () => {
    it('should dispatch GetUserBonuses and call initForm / initListeners', () => {
      spyOn(component, 'initForm').and.callThrough();
      spyOn(component, 'initListeners').and.callThrough();

      component.ngOnInit();

      expect(storeMock.dispatch).toHaveBeenCalledWith(GetUserBonuses());
      expect(component.initForm).toHaveBeenCalled();
      expect(component.initListeners).toHaveBeenCalled();
    });
  });

  describe('initForm()', () => {
    it('should create orderBonusesForm with bonus and formArrayCertificates controls', () => {
      component.initForm();

      expect(component.orderBonusesForm.contains('bonus')).toBeTrue();
      expect(component.orderBonusesForm.contains('formArrayCertificates')).toBeTrue();
      expect(component.orderBonusesForm.get('bonus').value).toBeFalse();
      const formArray = component.orderBonusesForm.get('formArrayCertificates');
      expect(formArray['length']).toBe(1);
    });
  });

  describe('addNewCertificate()', () => {
    it('should add a new control to formArrayCertificates', () => {
      component.initForm();
      const initialLength = component.formArrayCertificates.length;

      component.addNewCertificate();
      const newLength = component.formArrayCertificates.length;

      expect(newLength).toBe(initialLength + 1);
      const control = component.formArrayCertificates.at(newLength - 1);
      expect(control.errors).toBeTruthy();
    });
  });

  describe('deleteCertificate()', () => {
    beforeEach(() => {
      component.initForm();
      storeMock.dispatch.calls.reset();
    });

    it('should remove certificate from formArray and dispatch RemoveCertificate', () => {
      component.addNewCertificate();
      expect(component.formArrayCertificates.length).toBe(2);

      component.formArrayCertificates.at(0).setValue('CERT_TEST');
      component.deleteCertificate(0);

      expect(storeMock.dispatch).toHaveBeenCalled();
      expect(component.formArrayCertificates.length).toBe(1);
    });

    it('should add a new certificate if the array is empty after deletion', () => {
      expect(component.formArrayCertificates.length).toBe(1);
      component.deleteCertificate(0);
      expect(component.formArrayCertificates.length).toBe(1);
    });
  });

  describe('onActivateCertififcate()', () => {
    beforeEach(() => {
      component.initForm();
      component.formArrayCertificates.at(0).setValue('TESTCODE');
    });

    it('should call orderService.processCertificate and dispatch AddCertificate on success', () => {
      const responseMock = { points: 100, code: 'TESTCODE' };
      orderServiceMock.processCertificate.and.returnValue(of(responseMock));

      component.onActivateCertififcate(0);
      expect(orderServiceMock.processCertificate).toHaveBeenCalledWith('TESTCODE');
      expect(storeMock.dispatch).toHaveBeenCalled();
    });
  });

  describe('calculateAll() improvement', () => {
    it('should set bonus to false if leftToPay <= 0', () => {
      component.initForm();

      const bonusControl = component.orderBonusesForm.get('bonus') as FormControl;

      bonusControl.setValue(true);
      component.orderSum = 100;
      component.certificateSum = 150;

      component.calculateAll();
      expect(bonusControl.value).toBeFalse();
    });
  });
});
