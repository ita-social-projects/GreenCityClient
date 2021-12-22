import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminCertificateComponent } from './ubs-admin-certificate.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

describe('UbsAdminCertificateComponent', () => {
  let component: UbsAdminCertificateComponent;
  let fixture: ComponentFixture<UbsAdminCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, MatTableModule, InfiniteScrollModule],
      providers: [{ provide: MatDialogRef, useValue: {} }],
      declarations: [UbsAdminCertificateComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
