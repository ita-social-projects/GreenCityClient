import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { OrderService } from '../../services/order.service';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { AddPaymentComponent } from './add-payment.component';

describe('AddPaymentComponent', () => {
  let component: AddPaymentComponent;
  let fixture: ComponentFixture<AddPaymentComponent>;
  const matDialogRefMock = {
    close: jasmine.createSpy()
  };
  const matDialogMock = () => ({
    open: () => ({
      afterClosed: () => ({ pipe: () => ({ subscribe: (f) => f({}) }) })
    })
  });
  const fakePaymentData = {
    amount: 3,
    comment: 'fakeComment',
    paymentId: 'fakeID',
    id: 123,
    settlementdate: '1-1-1',
    imagePath: 'fakePath',
    receiptLink: 'fakeLink'
  };
  const mockedData = {
    orderId: 735,
    viewMode: false,
    payment: null
  };
  const dataFileMock = new File([''], 'test-file.jpeg', { type: 'image/jpeg' });
  const fakeFileHandle = {
    file: dataFileMock,
    url: 'fakeUrl'
  };
  const event = { target: { files: [dataFileMock] } };
  const orderServiceMock = jasmine.createSpyObj('orderService', ['addPaymentManually', 'updatePaymentManually', 'deleteManualPayment']);
  orderServiceMock.addPaymentManually.and.returnValue(of(fakePaymentData));
  orderServiceMock.updatePaymentManually.and.returnValue(of(fakePaymentData));
  orderServiceMock.deleteManualPayment.and.returnValue(of(3));
  const localeStorageServiceMock = jasmine.createSpyObj('localeStorageService', ['getCurrentLanguage']);
  localeStorageServiceMock.firstNameBehaviourSubject = of('fakeName');
  const dateAdapterMock = jasmine.createSpyObj('adapter', ['setLocale']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaymentComponent, LocalizedCurrencyPipe],
      imports: [HttpClientTestingModule, ReactiveFormsModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MatDialog, useFactory: matDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: LocalStorageService, useValue: localeStorageServiceMock },
        { provide: DateAdapter, useValue: dateAdapterMock },
        UntypedFormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`editMode has default value`, () => {
    expect(component.editMode).toBeFalsy();
  });

  it(`isDeleting has default value`, () => {
    expect(component.isDeleting).toBeFalsy();
  });

  it(`isUploading has default value`, () => {
    expect(component.isUploading).toBeFalsy();
  });

  it(`isImageSizeError has default value`, () => {
    expect(component.isImageSizeError).toBeFalsy();
  });

  it(`isImageTypeError has default value`, () => {
    expect(component.isImageTypeError).toBeFalsy();
  });

  it(`isInitialDataChanged has default value`, () => {
    expect(component.isInitialDataChanged).toBeFalsy();
  });

  it(`isInitialImageChanged has default value`, () => {
    expect(component.isInitialImageChanged).toBeFalsy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const spy = spyOn(component, 'initForm');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
      expect(component.adminName).toBe('fakeName');
      expect(component.orderId).toBe(735);
      expect(component.viewMode).toBeFalsy();
      expect(component.payment).toBeNull();
    });
  });

  describe('save', () => {
    it('makes expected calls', () => {
      const spy = spyOn(component, 'processPayment');
      component.addPaymentForm.controls.settlementdate.setValue(new Date());
      component.save();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('processPayment', () => {
    it('makes expected calls', () => {
      component.payment = { id: 7 } as any;
      component.processPayment(5, { form: 'fakeForm' as any, file: 'fakeFile' as any });
      expect(matDialogRefMock.close).toHaveBeenCalled();
      expect(orderServiceMock.updatePaymentManually).toHaveBeenCalledWith(7, 'fakeForm', 'fakeFile');
      expect(orderServiceMock.addPaymentManually).toHaveBeenCalledWith(5, 'fakeForm', 'fakeFile');
    });
  });

  describe('files', () => {
    it('makes expected calls in filesDropped', () => {
      const loadImageSpy = spyOn(component, 'loadImage');
      spyOn(component as any, 'showWarning').and.returnValue(false);
      component.filesDropped([fakeFileHandle] as any);
      expect(component.file).toEqual(dataFileMock);
      expect(loadImageSpy).toHaveBeenCalled();
    });

    it('makes expected calls in onFileSelect', () => {
      const loadImageSpy = spyOn(component, 'loadImage');
      spyOn(component as any, 'showWarning').and.returnValue(false);
      component.onFileSelect(event as any);
      expect(component.file).toEqual(dataFileMock);
      expect(loadImageSpy).toHaveBeenCalled();
    });

    it('gets false from showWarning', () => {
      const isShowWarning = (component as any).showWarning(dataFileMock);
      expect(isShowWarning).toBeFalsy();
    });

    it('gets true from showWarning', () => {
      const fileMock = new File([''], 'test-file.jpeg', { type: 'text/plain' });
      const isShowWarning = (component as any).showWarning(fileMock);
      expect(isShowWarning).toBeTruthy();
    });
  });

  describe('removeImage', () => {
    it(`is not edit mode`, () => {
      component.imagePreview = { src: 'fakePaht', name: 'fakeName' };
      component.file = fakeFileHandle as any;
      component.removeImage();
      expect(component.imagePreview.name).toBeNull();
      expect(component.imagePreview.src).toBeNull();
      expect(component.file).toBeNull();
    });

    it(`is edit mode`, () => {
      component.editMode = true;
      component.payment = { imagePath: 'fakePath' } as any;
      component.imagePreview = { src: 'fakePath', name: 'fakeName' };
      component.file = fakeFileHandle as any;
      component.removeImage();
      expect(component.imagePreview.name).toBeNull();
      expect(component.imagePreview.src).toBeNull();
      expect(component.file).toBeNull();
      expect(component.isInitialImageChanged).toBeTruthy();
    });
  });

  describe('editPayment', () => {
    it(`payment has been edited`, () => {
      component.payment = {
        settlementdate: '',
        amount: 13,
        receiptLink: '',
        paymentId: ''
      } as any;
      component.editPayment();
      component.addPaymentForm.controls.amount.setValue('3');
      expect(component.isInitialDataChanged).toBeTruthy();
    });
  });

  describe('deletePayment', () => {
    it('should call deleteManualPayment', () => {
      component.payment = { id: 7 } as any;
      component.deletePayment();
      expect(orderServiceMock.deleteManualPayment).toHaveBeenCalledWith(7);
    });
  });

  it('newFormat should format the input value to have two decimal places', () => {
    const sumPayment = {
      target: { value: '444.888' }
    } as unknown as Event;
    component.newFormat(sumPayment);
    expect((sumPayment.target as HTMLInputElement).value).toEqual('444.89');
  });

  describe('onChoosePayment', () => {
    it('should set isPhotoContainerChoosen to true and isLinkToBillChoosed to false when event value is "photoBill"', () => {
      const eventBtn: MatRadioChange = { value: 'photoBill', source: null };
      component.onChoosePayment(eventBtn);
      expect(component.isPhotoContainerChoosen).toBeTruthy();
      expect(component.isLinkToBillChoosed).toBeFalsy();
    });

    it('should set isLinkToBillChoosed to true and isPhotoContainerChoosen to false when event value is "linkToBill"', () => {
      const eventBtn: MatRadioChange = { value: 'linkToBill', source: null };
      component.onChoosePayment(eventBtn);
      expect(component.isLinkToBillChoosed).toBeTruthy();
      expect(component.isPhotoContainerChoosen).toBeFalsy();
    });

    it('should set Validators.required for receiptLink control when isLinkToBillChoosed is true', () => {
      const eventBtn: MatRadioChange = { value: 'linkToBill', source: null };
      component.onChoosePayment(eventBtn);
      const receiptLinkControl = component.addPaymentForm.get('receiptLink');
      expect(receiptLinkControl.validator({} as AbstractControl)).toEqual({ required: true });
    });

    it('should clear Validators for receiptLink control when isLinkToBillChoosed is false', () => {
      const eventBtn: MatRadioChange = { value: 'photoBill', source: null };
      component.onChoosePayment(eventBtn);
      const receiptLinkControl = component.addPaymentForm.get('receiptLink');
      expect(receiptLinkControl.validator).toBeNull();
    });

    it('should call updateValueAndValidity for receiptLink control', () => {
      const eventBtn: MatRadioChange = { value: 'photoBill', source: null };
      const receiptLinkControl = component.addPaymentForm.get('receiptLink');
      const spy = spyOn(receiptLinkControl, 'updateValueAndValidity');
      component.onChoosePayment(eventBtn);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('showErrorMessage', () => {
    it('should return true if isLinkToBillChoosed is true, receiptLink has no value and receiptLink control is touched', () => {
      component.isLinkToBillChoosed = true;
      component.addPaymentForm.get('receiptLink').setValue('');
      component.addPaymentForm.get('receiptLink').markAsTouched();
      expect(component.showErrorMessage()).toBeTruthy();
    });

    it('should return false if isLinkToBillChoosed is true, receiptLink has a value and receiptLink control is touched', () => {
      component.isLinkToBillChoosed = true;
      component.addPaymentForm.get('receiptLink').setValue('https://example.com/receipt');
      component.addPaymentForm.get('receiptLink').markAsTouched();
      expect(component.showErrorMessage()).toBeFalsy();
    });

    it('should return true if isPhotoContainerChoosen is true and imagePreview.src is null', () => {
      component.isPhotoContainerChoosen = true;
      component.imagePreview.src = null;
      expect(component.showErrorMessage()).toBeTruthy();
    });

    it('should return false if isPhotoContainerChoosen is true and imagePreview.src has a value', () => {
      component.isPhotoContainerChoosen = true;
      component.imagePreview.src = 'https://example.com/image.jpg';
      expect(component.showErrorMessage()).toBeFalsy();
    });

    it('should return false if both isLinkToBillChoosed and isPhotoContainerChoosen are false', () => {
      component.isLinkToBillChoosed = false;
      component.isPhotoContainerChoosen = false;
      expect(component.showErrorMessage()).toBeFalsy();
    });
  });

  describe('isFormValid', () => {
    it('should return true if settlementdate, amount, or paymentId controls are invalid and touched', () => {
      component.addPaymentForm.get('settlementdate').setErrors({ invalid: true });
      component.addPaymentForm.get('settlementdate').markAsTouched();
      expect(component.isFormValid()).toBeTruthy();
    });

    it('should return false if settlementdate, amount, and paymentId controls are all valid and touched', () => {
      component.addPaymentForm.get('settlementdate').setValue(new Date());
      component.addPaymentForm.get('amount').setValue(100);
      component.addPaymentForm.get('paymentId').setValue('12345');
      expect(component.isFormValid()).toBeFalsy();
    });
  });

  describe('isDisabledSubmitBtn', () => {
    it('should return true if the form is not touched or not valid', () => {
      component.addPaymentForm.markAsUntouched();
      expect(component.isDisabledSubmitBtn()).toBeTruthy();

      component.addPaymentForm.setErrors({ invalid: true });
      component.addPaymentForm.markAsTouched();
      expect(component.isDisabledSubmitBtn()).toBeTruthy();
    });

    it('should return true if in view mode and not in edit mode', () => {
      component.viewMode = true;
      component.editMode = false;
      expect(component.isDisabledSubmitBtn()).toBeTruthy();
    });

    it('should return true if photo container is chosen but no image preview', () => {
      component.isPhotoContainerChoosen = true;
      component.imagePreview.src = null;
      expect(component.isDisabledSubmitBtn()).toBeTruthy();
    });

    it('should return true if link to bill is chosen but no receipt link is set', () => {
      component.isLinkToBillChoosed = true;
      component.addPaymentForm.get('receiptLink').setValue('');
      expect(component.isDisabledSubmitBtn()).toBeTruthy();
    });

    it('should return true if in edit mode and no data or image has changed', () => {
      component.editMode = true;
      component.isInitialDataChanged = false;
      component.isInitialImageChanged = false;
      expect(component.isDisabledSubmitBtn()).toBeTruthy();
    });

    it('should return true if no radio button is selected', () => {
      component.isPhotoContainerChoosen = false;
      component.isLinkToBillChoosed = false;
      expect(component.isDisabledSubmitBtn()).toBeTruthy();
    });
  });
});
