import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UbsAdminCertificateAddCertificatePopUpComponent', () => {
  let component: UbsAdminCertificateAddCertificatePopUpComponent;
  let fixture: ComponentFixture<UbsAdminCertificateAddCertificatePopUpComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCertificateAddCertificatePopUpComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [FormBuilder, { provide: MatDialogRef, useValue: {} }]
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
});
