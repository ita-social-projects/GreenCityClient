import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IMaskModule } from 'angular-imask';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UbsAdminCertificateAddCertificatePopUpComponent', () => {
  let component: UbsAdminCertificateAddCertificatePopUpComponent;
  let fixture: ComponentFixture<UbsAdminCertificateAddCertificatePopUpComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCertificateAddCertificatePopUpComponent],
      imports: [MatDialogModule, HttpClientTestingModule, ReactiveFormsModule, IMaskModule],
      providers: [FormBuilder, { provide: MatDialogRef, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCertificateAddCertificatePopUpComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if inputs contain only null', () => {
    const newValue = '0';
    component.valueChangeMonthCount(newValue);
    component.valueChangePointsValue(newValue);
    expect(component.monthCountDisabled).toBeTruthy();
    expect(component.pointsValueDisabled).toBeTruthy();
  });

  it('should check if inputs contain not null', () => {
    const newValue = '10';
    component.valueChangeMonthCount(newValue);
    component.valueChangePointsValue(newValue);
    expect(component.monthCountDisabled).toBeFalsy();
    expect(component.pointsValueDisabled).toBeFalsy();
  });
});
