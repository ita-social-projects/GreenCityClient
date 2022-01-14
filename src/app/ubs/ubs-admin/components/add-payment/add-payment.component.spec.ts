import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { OrderService } from '../../services/order.service';

import { AddPaymentComponent } from './add-payment.component';

fdescribe('AddPaymentComponent', () => {
  let component: AddPaymentComponent;
  let fixture: ComponentFixture<AddPaymentComponent>;
  let localeStorageService: LocalStorageService;
  const matDialogRefMock = () => ({
    close: () => ({})
  });
  const matDialogMock = () => ({
    open: () => of(true)
  });
  const mockedData = {
    orderId: 735,
    viewMode: false,
    payment: null
  };
  const dataFileMock = new File([''], 'test-file.jpeg');
  const fakeFileHandle = {
    file: dataFileMock,
    url: 'fakeUrl'
  };
  const orderServiceMock = jasmine.createSpyObj('orderService', ['addPaymentManually', 'updatePaymentManually', 'deleteManualPayment']);
  orderServiceMock.addPaymentManually.and.returnValue(of(true));
  orderServiceMock.updatePaymentManually.and.returnValue(of(true));
  orderServiceMock.deleteManualPayment.and.returnValue(of(true));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaymentComponent],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: OrderService, useValue: orderServiceMock },
        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentComponent);
    component = fixture.componentInstance;
    localeStorageService = TestBed.inject(LocalStorageService);
    (localeStorageService as any).firstNameBehaviourSubject = of('fakeName');
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
      expect(component.payment).toBe(null);
    });
  });

  describe('save', () => {
    it('makes expected calls', () => {
      const spy = spyOn(component, 'processPayment');
      component.save();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('removeImage', () => {
    it(`is not edit mode`, () => {
      component.imagePreview = { src: 'fakePaht', name: 'fakeName' };
      component.file = fakeFileHandle;
      component.removeImage();
      expect(component.imagePreview.name).toBe(null);
      expect(component.imagePreview.src).toBe(null);
      expect(component.file).toBe(null);
    });

    it(`is edit mode`, () => {
      component.editMode = true;
      component.payment = { imagePath: 'fakePath' } as any;
      component.imagePreview = { src: 'fakePath', name: 'fakeName' };
      component.file = fakeFileHandle;
      component.removeImage();
      expect(component.imagePreview.name).toBe(null);
      expect(component.imagePreview.src).toBe(null);
      expect(component.file).toBe(null);
      expect(component.isInitialImageChanged).toBeTruthy();
    });
  });

  describe('editPayment', () => {
    xit(`makes expected calls`, () => {
      component.imagePreview = { src: 'fakePaht', name: 'fakeName' };
      component.editPayment();
      // expect(component.imagePreview.name).toBe(null);
      // expect(component.imagePreview.src).toBe(null);
      // expect(component.file).toBe(null);
    });
  });
});
