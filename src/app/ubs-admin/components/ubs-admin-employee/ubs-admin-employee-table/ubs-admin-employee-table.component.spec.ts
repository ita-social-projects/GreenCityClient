import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
  ubsAdminEmployeeServiceMock.deleteEmployee.and.returnValue(of());
  ubsAdminEmployeeServiceMock.getEmployees.and.returnValue(of());
  ubsAdminEmployeeServiceMock.getAllStations.and.returnValue(of());
  ubsAdminEmployeeServiceMock.getAllPositions.and.returnValue(of());
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeTableComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: UbsAdminEmployeeService, useValue: ubsAdminEmployeeServiceMock }
      ]
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
