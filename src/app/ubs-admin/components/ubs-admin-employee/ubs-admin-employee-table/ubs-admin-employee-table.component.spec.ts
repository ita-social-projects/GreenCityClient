import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { of } from 'rxjs';
import { UbsAdminEmployeeService } from 'src/app/ubs-admin/services/ubs-admin-employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

import { UbsAdminEmployeeTableComponent } from './ubs-admin-employee-table.component';

fdescribe('UbsAdminEmployeeTableComponent', () => {
  let component: UbsAdminEmployeeTableComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeTableComponent>;
  let matDialog: MatDialog;
  let ubsAdminEmployeeServiceMock = jasmine.createSpyObj('ubsAdminEmployeeServiceMock', [
    'deleteEmployee',
    'getEmployees',
    'getAllStations',
    'getAllPositions'
  ]);
  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };
  const deleteDialogData = {
    popupTitle: 'fake-title',
    popupConfirm: 'fake-yes',
    popupCancel: 'fake-no'
  };
  const fakeTableItems = {
    page: ['fakeData1', 'fakeData2'],
    totalPages: 7
  };
  ubsAdminEmployeeServiceMock.deleteEmployee.and.returnValue(of());
  ubsAdminEmployeeServiceMock.getEmployees.and.returnValue(of(fakeTableItems));
  ubsAdminEmployeeServiceMock.getAllStations.and.returnValue(of());
  ubsAdminEmployeeServiceMock.getAllPositions.and.returnValue(of());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeTableComponent],
      imports: [HttpClientTestingModule, MatDialogModule, MatTableModule, InfiniteScrollModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: UbsAdminEmployeeService, useValue: ubsAdminEmployeeServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeTableComponent);
    component = fixture.componentInstance;
    matDialog = TestBed.inject(MatDialog);
    component.deleteDialogData = deleteDialogData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTable inside ngOnInit', () => {
    const spy = spyOn(component, 'getTable');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call setDisplayedColumns inside getTable', () => {
    const spy = spyOn(component, 'setDisplayedColumns');
    component.getTable();
    expect(spy).toHaveBeenCalled();
    expect(component.tableData).toEqual(['fakeData1', 'fakeData2']);
    expect(component.dataSource.data).toEqual(['fakeData1', 'fakeData2']);
    expect(component.totalPagesForTable).toBe(7);
    expect(component.isUpdateTable).toBe(false);
    expect(component.isLoading).toBe(false);
  });

  it('should change the init data after calling setDisplayedColumns', () => {
    component.displayedColumns = [];
    component.setDisplayedColumns();
    expect(component.displayedColumns).toEqual(['editOrDelete', 'fullName', 'position', 'location', 'email', 'phoneNumber']);
  });

  it('should call getTable inside onScroll', () => {
    component.isUpdateTable = false;
    component.currentPageForTable = 3;
    component.totalPagesForTable = 9;
    const spy = spyOn(component, 'updateTable');
    component.onScroll();
    expect(spy).toHaveBeenCalled();
    expect(component.currentPageForTable).toBe(4);
  });

  it('should call open inside openModal', () => {
    const employeeData = { data: 'fake' };
    const spy = spyOn(matDialog, 'open');
    component.openModal(employeeData as any);
    expect(spy).toHaveBeenCalledWith(EmployeeFormComponent, {
      data: employeeData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  });

  it('should call deleteEmployee method inside deleteEmployee', () => {
    spyOn(matDialog, 'open').and.returnValue(dialogRefStub as any);
    component.deleteEmployee(7);
    expect(ubsAdminEmployeeServiceMock.deleteEmployee).toHaveBeenCalledWith(7);
  });
});
