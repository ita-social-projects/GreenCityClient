// import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
// import { UbsOrderCertificateComponent } from './ubs-order-certificate.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { of } from 'rxjs';
// import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
// import { UbsOrderLocationPopupComponent } from '../ubs-order-location-popup/ubs-order-location-popup.component';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TranslateModule, TranslateStore } from '@ngx-translate/core';
// import { RouterTestingModule } from '@angular/router/testing';
// import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { UBSOrderFormService } from 'src/app/ubs/ubs/services/ubs-order-form.service';
// import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IMaskModule } from 'angular-imask';
// import { Store } from '@ngrx/store';
// import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
//
// describe('UbsOrderCertificateComponent', () => {
//   let component: UbsOrderCertificateComponent;
//   let fixture: ComponentFixture<UbsOrderCertificateComponent>;
//   const shareFormService = jasmine.createSpyObj('shareFormService', [
//     'orderDetails',
//     'changeAddCertButtonVisibility',
//     'addCert',
//     'changeOrderDetails'
//   ]);
//   shareFormService.addCert = of(false);
//
//   const localStorageService = jasmine.createSpyObj('localStorageService', [
//     'getCurrentLanguage',
//     'languageSubject',
//     'getUbsOrderData',
//     'getUserId'
//   ]);
//
//   const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
//   storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));
//
//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [UbsOrderCertificateComponent, LocalizedCurrencyPipe, UbsOrderLocationPopupComponent],
//       imports: [
//         FormsModule,
//         ReactiveFormsModule,
//         HttpClientTestingModule,
//         TranslateModule.forRoot(),
//         RouterTestingModule,
//         MatDialogModule,
//         BrowserAnimationsModule,
//         IMaskModule
//       ],
//       providers: [
//         { provide: MatDialogRef, useValue: {} },
//         { provide: UBSOrderFormService, useValue: shareFormService },
//         { provide: LocalStorageService, useValue: localStorageService },
//         { provide: TranslateStore, useClass: TranslateStore },
//         {
//           provide: Store,
//           useValue: {
//             pipe: () => of(),
//             dispatch: () => of(),
//             select: jasmine.createSpy().and.returnValue(of({ order: ubsOrderServiseMock })) // Mock selectors
//           }
//         }
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     }).compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(UbsOrderCertificateComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { UbsOrderCertificateComponent } from './ubs-order-certificate.component';
import { OrderService } from '../../../services/order.service';
import { GetUserBonuses } from 'src/app/store/actions/ubs-user.actions';
import { TranslateModule } from '@ngx-translate/core';
import { CCertificate } from 'src/app/ubs/ubs/models/ubs.model';

// A simple mock for your OrderService if needed
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
      providers: [FormBuilder, { provide: OrderService, useValue: orderServiceMock }, { provide: Store, useValue: storeMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderCertificateComponent);
    component = fixture.componentInstance;
  });

  /**
   * Test: ngOnInit()
   * Opinion: This test ensures that when the component initializes,
   * certain store actions are dispatched and forms/listeners are set up.
   */
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

  /**
   * Test: initForm()
   * Opinion: We verify that the form is initialized with the correct structure,
   * default values, and validators.
   */
  describe('initForm()', () => {
    it('should create orderBonusesForm with bonus and formArrayCertificates controls', () => {
      component.initForm();

      expect(component.orderBonusesForm.contains('bonus')).toBeTrue();
      expect(component.orderBonusesForm.contains('formArrayCertificates')).toBeTrue();

      // Bonus default
      expect(component.orderBonusesForm.get('bonus').value).toBeFalse();

      // Certificates array length
      const formArray = component.orderBonusesForm.get('formArrayCertificates');
      expect(formArray['length']).toBe(1); // Because addNewCertificate is called inside initForm
    });
  });

  /**
   * Test: addNewCertificate()
   * Opinion: Confirm it pushes a new control into the form array with
   * the expected validators.
   */
  describe('addNewCertificate()', () => {
    it('should add a new control to formArrayCertificates', () => {
      component.initForm(); // ensures everything is set up
      const initialLength = component.formArrayCertificates.length;

      component.addNewCertificate();
      const newLength = component.formArrayCertificates.length;

      expect(newLength).toBe(initialLength + 1);
      // Optionally, check the validator:
      const control = component.formArrayCertificates.at(newLength - 1);
      expect(control.errors).toBeTruthy(); // because it’s empty and required
    });
  });

  /**
   * Test: deleteCertificate()
   * Opinion: This test ensures that removing a certificate dispatches
   * the correct action and removes the form control.
   */
  describe('deleteCertificate()', () => {
    beforeEach(() => {
      component.initForm();
      storeMock.dispatch.calls.reset();
    });

    it('should remove certificate from formArray and dispatch RemoveCertificate', () => {
      // Add second certificate so we can remove it
      component.addNewCertificate();
      expect(component.formArrayCertificates.length).toBe(2);

      // We fake some code in the first certificate
      component.formArrayCertificates.at(0).setValue('CERT_TEST');

      // Now remove certificate at index 0
      component.deleteCertificate(0);

      expect(storeMock.dispatch).toHaveBeenCalled();
      expect(component.formArrayCertificates.length).toBe(1);
    });

    it('should add a new certificate if the array is empty after deletion', () => {
      // We only have 1 item from initForm
      expect(component.formArrayCertificates.length).toBe(1);

      component.deleteCertificate(0);
      // Now the array should have re-added a new control if the last was removed
      expect(component.formArrayCertificates.length).toBe(1);
    });
  });

  /**
   * Test: onActivateCertififcate()
   * Opinion: We want to make sure the method processes the certificate
   * by calling orderService and dispatches the right actions.
   */
  describe('onActivateCertififcate()', () => {
    beforeEach(() => {
      component.initForm();
      // Mock the certificate code in the form
      component.formArrayCertificates.at(0).setValue('TESTCODE');
    });

    it('should do nothing if code is empty', () => {
      component.formArrayCertificates.at(0).setValue('');
      component.onActivateCertififcate(0);

      expect(orderServiceMock.processCertificate).not.toHaveBeenCalled();
    });

    it('should call orderService.processCertificate and dispatch AddCertificate on success', () => {
      const responseMock = { points: 100, code: 'TESTCODE' };
      orderServiceMock.processCertificate.and.returnValue(of(responseMock));

      component.onActivateCertififcate(0);
      expect(orderServiceMock.processCertificate).toHaveBeenCalledWith('TESTCODE');
      expect(storeMock.dispatch).toHaveBeenCalled(); // dispatches AddCertificate
    });
  });

  /**
   * Test: calculateAll()
   * Opinion: Check that pointsUsed and certificateSum are set,
   * especially for edge cases. This is a crucial piece of logic.
   */
  describe('calculateAll() improvement', () => {
    it('should set bonus to false if leftToPay <= 0', () => {
      component.initForm();

      // Let’s get the actual FormControl, so we can spy on setValue if needed
      const bonusControl = component.orderBonusesForm.get('bonus') as FormControl;

      // Turn bonus on
      bonusControl.setValue(true);

      // Fake numbers so that leftToPay <= 0
      component.orderSum = 100;
      component.certificateSum = 150;

      // Call the method
      component.calculateAll();

      // Check that bonus was set to false
      expect(bonusControl.value).toBeFalse();
    });
  });
});
