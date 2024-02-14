import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { UbsAdminTableExcelPopupComponent } from './ubs-admin-table-excel-popup.component';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { AdminCertificateService } from 'src/app/ubs/ubs-admin/services/admin-certificate.service';
import { AdminCustomersService } from 'src/app/ubs/ubs-admin/services/admin-customers.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import * as XLSX from 'xlsx';

describe('UbsAdminTableExcelPopupComponent', () => {
  let component: UbsAdminTableExcelPopupComponent;
  let fixture: ComponentFixture<UbsAdminTableExcelPopupComponent>;

  const FormGroupMock = new UntypedFormGroup({});
  const languageServiceMock = jasmine.createSpyObj('LanguageService', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('en');

  const AdminTableServiceFake = jasmine.createSpyObj('adminTableService', ['getTable']);

  const AdminCertificateServiceFake = jasmine.createSpyObj('adminCertificateService', ['getTable']);

  const AdminCustomerServiceFake = jasmine.createSpyObj('adminCustomerService', ['getCustomers']);

  const dataForTranslation = [
    {
      titleForSorting: 'column1',
      checked: [
        { key: 'item1', en: 'value1', ua: 'valeur1' },
        { key: 'item2', en: 'value2', ua: 'valeur2' }
      ]
    },
    {
      titleForSorting: 'column2',
      checked: [
        { key: 'item3', en: 'value3', ua: 'valeur3' },
        { key: 'item4', en: 'value4', ua: 'valeur4' }
      ]
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule],
      declarations: [UbsAdminTableExcelPopupComponent],
      providers: [
        { provide: UntypedFormGroup, useValue: FormGroupMock },
        { provide: AdminTableService, useValue: AdminTableServiceFake },
        { provide: AdminCertificateService, useValue: AdminCertificateServiceFake },
        { provide: AdminCustomersService, useValue: AdminCustomerServiceFake },
        { provide: LanguageService, useValue: languageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTableExcelPopupComponent);
    component = fixture.componentInstance;
    // component.language = 'en';
    component.dataForTranslation = dataForTranslation;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should change tableView', () => {
    component.tableView = '';
    component.ngOnInit();
    expect(component.tableView).toBe('wholeTable');
  });

  it('after saveTable should call getOrdersTable', () => {
    spyOn(component, 'createXLSX');
    spyOn(component, 'getOrdersTable').and.returnValue(
      new Promise((res, rej) => {
        return true;
      })
    );
    component.isLoading = false;
    component.tableView = 'wholeTable';
    component.name = 'Orders-Table.xlsx';
    component.allElements = 2;
    component.saveTable();
    expect(component.getOrdersTable).toHaveBeenCalledTimes(1);
    expect(component.getOrdersTable).toHaveBeenCalledWith(0, 2, '', 'DESC', 'id');
    expect(component.isLoading).toBe(true);
  });

  it('after saveTable should call getCertificatesTable', () => {
    spyOn(component, 'getCertificatesTable').and.returnValue(
      new Promise((res) => {
        return true;
      })
    );
    component.tableView = 'wholeTable';
    component.name = 'Certificates-Table.xlsx';
    component.saveTable();
    expect(component.getCertificatesTable).toHaveBeenCalledTimes(1);
  });

  it('after saveTable should call getCustomersTable', () => {
    spyOn(component, 'getCustomersTable').and.returnValue(
      new Promise((res) => {
        return true;
      })
    );
    component.tableView = 'wholeTable';
    component.name = 'Customers-Table.xlsx';
    component.saveTable();
    expect(component.getCustomersTable).toHaveBeenCalledTimes(1);
  });

  it('after saveTable should call getOrdersTable', () => {
    spyOn(component, 'getOrdersTable').and.returnValue(
      new Promise((res) => {
        return true;
      })
    );
    component.tableView = 'currentFilter';
    component.name = 'Orders-Table.xlsx';
    component.saveTable();
    expect(component.getOrdersTable).toHaveBeenCalledTimes(1);
  });

  it('after saveTable should call getCertificatesTable', () => {
    spyOn(component, 'getCertificatesTable').and.returnValue(
      new Promise((res) => {
        return true;
      })
    );
    component.tableView = 'currentFilter';
    component.name = 'Certificates-Table.xlsx';
    component.saveTable();
    expect(component.getCertificatesTable).toHaveBeenCalledTimes(1);
  });

  it('after saveTable should call getCustomersTable', () => {
    spyOn(component, 'getCustomersTable').and.returnValue(
      new Promise((res) => {
        return true;
      })
    );
    spyOn(component, 'createXLSX');
    component.tableView = 'currentFilter';
    component.name = 'Customers-Table.xlsx';
    component.saveTable();
    expect(component.getCustomersTable).toHaveBeenCalledTimes(1);
  });

  it('after getOrdersTable call  adminTableService.getTable should been call once', () => {
    AdminTableServiceFake.getTable.calls.reset();
    AdminTableServiceFake.getTable.and.returnValue(of({}));
    component.getOrdersTable(0, 3, '', 'DESC', 'id');
    expect((component as any).adminTableService.getTable).toHaveBeenCalledTimes(1);
  });

  it('after getCertificatesTable call  adminCertificateService.getTable should been call once', () => {
    AdminCertificateServiceFake.getTable.and.returnValue(of({}));
    component.getCertificatesTable(0, 3, '', 'DESC', 'id');
    expect((component as any).adminCertificateService.getTable).toHaveBeenCalledTimes(1);
  });

  it('after getCustomersTable call  adminCustomerService.getCustomers should been call once', () => {
    AdminCustomerServiceFake.getCustomers.and.returnValue(of({}));
    component.getCustomersTable(0, 3, '', 'DESC', 'id');
    expect((component as any).adminCustomerService.getCustomers).toHaveBeenCalledTimes(1);
  });

  it('createXLSX should call XLSX', () => {
    component.tableData = [{}];
    const spy1 = spyOn(XLSX.utils, 'json_to_sheet');
    const spy2 = spyOn(XLSX.utils, 'book_new');
    const spy3 = spyOn(XLSX.utils, 'book_append_sheet');
    const spy4 = spyOn(XLSX, 'writeFile');
    component.createXLSX();
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(spy4).toHaveBeenCalledTimes(1);
  });

  it('should get column value', () => {
    const columnKey = 'column1';
    const itemKey = 'item1';
    const expectedValue = 'value1';

    const result = component.getColumnValue(columnKey, itemKey);
    expect(result).toEqual(expectedValue);
  });
});
