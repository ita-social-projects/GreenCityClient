import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminCertificateComponent } from './ubs-admin-certificate.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up/ubs-admin-certificate-add-certificate-pop-up.component';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IAppState } from 'src/app/store/state/app.state';

describe('UbsAdminCertificateComponent', () => {
  let component: UbsAdminCertificateComponent;
  let fixture: ComponentFixture<UbsAdminCertificateComponent>;
  const initialState = {
    employees: null,
    error: null,
    employeesPermissions: []
  };
  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ employees: { employeesPermissions: mockData } }));

  const matDialogMock = jasmine.createSpyObj('dialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, MatTableModule, InfiniteScrollModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: Store, useValue: storeMock },
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
