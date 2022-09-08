import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminCertificateComponent } from './ubs-admin-certificate.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up/ubs-admin-certificate-add-certificate-pop-up.component';

describe('UbsAdminCertificateComponent', () => {
  let component: UbsAdminCertificateComponent;
  let fixture: ComponentFixture<UbsAdminCertificateComponent>;

  const matDialogMock = jasmine.createSpyObj('dialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, MatTableModule, InfiniteScrollModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock }
      ],
      declarations: [UbsAdminCertificateComponent, UbsAdminCertificateAddCertificatePopUpComponent],
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

  it('openAddCertificate should call getTable and dialog.open with expected parameters', () => {
    const props = {
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'cdk-table'
    };
    const spy = spyOn(component, 'getTable');

    component.openAddCertificate();

    expect(matDialogMock.open).toHaveBeenCalledWith(UbsAdminCertificateAddCertificatePopUpComponent, props);
    expect(spy).toHaveBeenCalled();
  });
});
