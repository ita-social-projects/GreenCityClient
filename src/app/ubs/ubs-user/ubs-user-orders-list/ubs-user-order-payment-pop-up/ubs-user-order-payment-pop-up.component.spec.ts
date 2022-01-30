import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { UBSOrderFormService } from 'src/app/ubs/ubs/services/ubs-order-form.service';

import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-order-payment-pop-up.component';

fdescribe('UbsUserOrderPaymentPopUpComponent', () => {
  let component: UbsUserOrderPaymentPopUpComponent;
  let fixture: ComponentFixture<UbsUserOrderPaymentPopUpComponent>;
  const matDialogRefMock = {};
  const mockedData = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrderPaymentPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: UBSOrderFormService, useValue: {} },
        { provide: LocalStorageService, useValue: {} },
        { provide: OrderService, useValue: {} },
        { provide: DomSanitizer, useValue: {} },
        { provide: Router, useValue: {} },
        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserOrderPaymentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
