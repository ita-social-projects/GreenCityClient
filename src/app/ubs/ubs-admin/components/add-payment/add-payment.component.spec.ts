import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { OrderService } from '../../services/order.service';

import { AddPaymentComponent } from './add-payment.component';

fdescribe('AddPaymentComponent', () => {
  let component: AddPaymentComponent;
  let fixture: ComponentFixture<AddPaymentComponent>;
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
});
