import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UbsAdminEmployeeService } from 'src/app/ubs-admin/services/ubs-admin-employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

import { UbsAdminEmployeeCardComponent } from './ubs-admin-employee-card.component';

describe('UbsAdminEmployeeCardComponent', () => {
  let component: UbsAdminEmployeeCardComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeCardComponent>;
  let matDialog: MatDialog;
  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };
  const EmployeePositions = [
    {
      id: 12,
      name: 'fakeName'
    }
  ];
  const ReceivingStations = [
    {
      id: 34,
      name: 'fakeName'
    }
  ];
  const data = {
    email: 'fakeEmail',
    employeePositions: EmployeePositions,
    firstName: 'fakeFirstName',
    id: 789,
    image: 'fakeImage',
    lastName: 'fakeLastName',
    phoneNumber: 'fakePhoneNumber',
    receivingStations: ReceivingStations
  };
  const ubsAdminEmployeeServiceMock = jasmine.createSpyObj('ubsAdminEmployeeServiceMock', ['deleteEmployee']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeCardComponent],
      imports: [TranslateModule.forRoot(), MatMenuModule, MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: UbsAdminEmployeeService, useValue: ubsAdminEmployeeServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeCardComponent);
    component = fixture.componentInstance;
    component.data = data;
    matDialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call open inside openModal', () => {
    const spy = spyOn(matDialog, 'open');
    component.openModal();
    expect(spy).toHaveBeenCalledWith(EmployeeFormComponent, {
      data,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  });

  it('should call deleteEmployee method inside deleteEmployee', () => {
    spyOn(matDialog, 'open').and.returnValue(dialogRefStub as any);
    ubsAdminEmployeeServiceMock.deleteEmployee.and.returnValue(of());
    component.deleteEmployee();
    expect(ubsAdminEmployeeServiceMock.deleteEmployee).toHaveBeenCalledWith(789);
  });
});
