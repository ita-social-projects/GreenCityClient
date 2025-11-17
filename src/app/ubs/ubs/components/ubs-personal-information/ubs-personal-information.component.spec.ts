import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UBSPersonalInformationComponent } from './ubs-personal-information.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { OrderService } from '../../services/order.service';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PersonalData } from '../../models/ubs.interface';
import { SetPersonalData, SetSecondFormStatus } from 'src/app/store/actions/order.actions';
import { addressIdSelector, personalDataSelector } from 'src/app/store/selectors/order.selectors';
import { WarningPopUpComponent } from 'src/app/greencity/shared/components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

class MockMatDialogRef {
  close() {}
}

const personalDataMock: PersonalData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phoneNumber: '380671234567',
  isAnotherClient: false,
  addressComment: 'Leave at the doorstep.',
  city: 'Kyiv',
  cityEn: 'Kyiv',
  district: 'Shevchenkivskyi',
  districtEn: 'Shevchenkivskyi',
  street: 'Khreshchatyk',
  streetEn: 'Khreshchatyk',
  region: 'Kyivska',
  regionEn: 'Kyivska',
  senderEmail: 'test@example.com',
  senderFirstName: 'Test',
  senderLastName: 'User',
  senderPhoneNumber: '380671234567'
};

describe('UBSPersonalInformationComponent', () => {
  let component: UBSPersonalInformationComponent;
  let fixture: ComponentFixture<UBSPersonalInformationComponent>;
  let store: MockStore;
  let dialog: MatDialog;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const initialState = {
    order: {
      personalData: personalDataMock,
      existingOrderInfo: null,
      addressId: 1
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UBSPersonalInformationComponent],
      imports: [ReactiveFormsModule, MatDialogModule, NoopAnimationsModule, HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [
        FormBuilder,
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: OrderService, useValue: {} },
        { provide: LocalStorageService, useValue: {} },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatDialogRef, useClass: MockMatDialogRef }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSPersonalInformationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize listeners for a new order if no existingOrderId is present', fakeAsync(() => {
      const spy = spyOn(component, 'initListenersForNewOrder').and.callThrough();
      spyOn(component, 'initListenersForExistingOrder').and.callThrough();

      component.ngOnInit();
      tick();

      expect(spy).toHaveBeenCalled();
      expect(component.initListenersForExistingOrder).not.toHaveBeenCalled();
    }));

    it('should initialize listeners for an existing order if existingOrderId is present', fakeAsync(() => {
      Object.defineProperty(activatedRoute, 'queryParams', { value: of({ existingOrderId: 1 }) });
      const newOrderSpy = spyOn(component, 'initListenersForNewOrder').and.callThrough();
      const existingOrderSpy = spyOn(component, 'initListenersForExistingOrder').and.callThrough();

      component.ngOnInit();
      tick();

      expect(newOrderSpy).not.toHaveBeenCalled();
      expect(existingOrderSpy).toHaveBeenCalled();
    }));
  });

  describe('initListenersForNewOrder', () => {
    it('should set personalData and call initForm', fakeAsync(() => {
      const initFormSpy = spyOn(component, 'initForm');
      store.overrideSelector(personalDataSelector, personalDataMock);

      component.initListenersForNewOrder();
      tick();

      expect(component.personalData).toEqual(personalDataMock);
      expect(initFormSpy).toHaveBeenCalled();
    }));
  });

  describe('initForm', () => {
    beforeEach(() => {
      component.personalData = personalDataMock;
      component.initForm();
    });

    it('should create the personalDataForm with correct controls and initial values', () => {
      expect(component.personalDataForm).toBeInstanceOf(FormGroup);
      expect(component.personalDataForm.controls.firstName.value).toBe(personalDataMock.firstName);
      expect(component.personalDataForm.controls.lastName.value).toBe(personalDataMock.lastName);
      expect(component.personalDataForm.controls.email.value).toBe(personalDataMock.email);
      expect(component.personalDataForm.controls.phoneNumber.value).toBe(personalDataMock.phoneNumber);
      expect(component.personalDataForm.controls.isAnotherClient.value).toBe(personalDataMock.isAnotherClient);
    });

    it('should sync sender fields with client fields when isAnotherClient is false', fakeAsync(() => {
      component.personalDataForm.controls.isAnotherClient.setValue(false);
      component.firstName.setValue('New');
      component.lastName.setValue('Client');
      tick();

      expect(component.senderFirstName.value).toBe('New');
      expect(component.senderLastName.value).toBe('Client');
    }));

    it('should clear sender fields when isAnotherClient is toggled to true', fakeAsync(() => {
      component.personalDataForm.controls.isAnotherClient.setValue(false);
      tick();
      component.personalDataForm.controls.isAnotherClient.setValue(true);
      tick();

      expect(component.senderFirstName.value).toBe('');
      expect(component.senderLastName.value).toBe('');
      expect(component.senderPhoneNumber.value).toBe('');
      expect(component.senderEmail.value).toBe(null);
    }));
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.personalData = personalDataMock;
      component.initForm();
    });

    it('should validate firstName and lastName with namePattern', () => {
      component.firstName.setValue('123');
      expect(component.firstName.invalid).toBeTrue();
      component.firstName.setValue('ValidName');
      expect(component.firstName.valid).toBeTrue();
    });

    it('should validate email with emailPattern', () => {
      component.email.setValue('invalid-email');
      expect(component.email.invalid).toBeTrue();
      component.email.setValue('valid@email.com');
      expect(component.email.valid).toBeTrue();
    });

    it('should validate phoneNumber with PhoneNumberValidator', () => {
      component.phoneNumber.setValue('12345');
      expect(component.phoneNumber.invalid).toBeTrue();
      component.phoneNumber.setValue('380671234567');
      expect(component.phoneNumber.valid).toBeTrue();
    });

    it('should accept email addresses up to 50 characters', () => {
      const maxLengthEmail = 'a'.repeat(38) + '@example.com';
      component.email.setValue(maxLengthEmail);
      expect(component.email.valid).toBeTrue();

      const tooLongEmail = 'a'.repeat(39) + '@example.com';
      component.email.setValue(tooLongEmail);
      expect(component.email.invalid).toBeTrue();
    });
  });

  describe('Store Dispatches', () => {
    it('should dispatch SetPersonalData with the updated form values on form valueChanges', fakeAsync(() => {
      component.personalData = personalDataMock;
      component.initForm();

      const newFirstName = 'Updated';
      component.firstName.setValue(newFirstName);

      tick();

      const expectedPersonalData = {
        ...personalDataMock,
        firstName: newFirstName,
        senderFirstName: newFirstName
      };

      expect(store.dispatch).toHaveBeenCalledWith(
        SetPersonalData({
          personalData: expectedPersonalData
        })
      );
    }));

    it('should dispatch SetSecondFormStatus with isValid=true when form is valid and addressId exists', fakeAsync(() => {
      component.personalData = personalDataMock;
      component.initForm();

      store.overrideSelector(addressIdSelector, 1);
      component.personalDataForm.patchValue({
        ...personalDataMock,
        isAnotherClient: false,
        senderFirstName: personalDataMock.firstName,
        senderLastName: personalDataMock.lastName,
        senderEmail: personalDataMock.email,
        senderPhoneNumber: personalDataMock.phoneNumber
      });

      tick();
      expect(store.dispatch).toHaveBeenCalledWith(SetSecondFormStatus({ isValid: true }));
    }));

    it('should dispatch SetSecondFormStatus with isValid=false when form is invalid', fakeAsync(() => {
      component.personalData = personalDataMock;
      component.initForm();

      component.firstName.setValue('');
      store.overrideSelector(addressIdSelector, 1);
      tick();

      expect(store.dispatch).toHaveBeenCalledWith(SetSecondFormStatus({ isValid: false }));
    }));
  });

  describe('Method calls', () => {
    it('should call router.navigate on onCancel when dialog is confirmed', fakeAsync(() => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(false)
      } as MatDialogRef<WarningPopUpComponent>);

      component.onCancel();
      tick();

      expect(dialog.open).toHaveBeenCalledWith(WarningPopUpComponent, component.popupConfig);
      expect(router.navigate).toHaveBeenCalledWith(['ubs']);
    }));

    it('should not call router.navigate on onCancel when dialog is dismissed', fakeAsync(() => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<WarningPopUpComponent>);

      component.onCancel();
      tick();

      expect(dialog.open).toHaveBeenCalledWith(WarningPopUpComponent, component.popupConfig);
      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('should dispatch SetPersonalData with the correct values', fakeAsync(() => {
      component.personalData = personalDataMock;
      component.initForm();

      const newEmail = 'new@email.com';
      component.email.setValue(newEmail);

      tick();

      const expectedPersonalData: PersonalData = {
        ...personalDataMock,
        email: newEmail,
        senderEmail: newEmail
      };

      expect(store.dispatch).toHaveBeenCalledWith(SetPersonalData({ personalData: expectedPersonalData }));
    }));

    it('should correctly call ngOnDestroy', () => {
      const destroySubject = (component as any).$destroy;
      spyOn(destroySubject, 'next');
      spyOn(destroySubject, 'complete');

      component.ngOnDestroy();

      expect(destroySubject.next).toHaveBeenCalled();
      expect(destroySubject.complete).toHaveBeenCalled();
    });
  });
});
