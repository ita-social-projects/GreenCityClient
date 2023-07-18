import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminEmployeePermissionsFormComponent } from './ubs-admin-employee-permissions-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

describe('UbsAdminEmployeePermissionsFormComponent', () => {
  let component: UbsAdminEmployeePermissionsFormComponent;
  let fixture: ComponentFixture<UbsAdminEmployeePermissionsFormComponent>;

  const mockedEmployee = { id: 1, email: 'aaaa@gmail.com' };
  const employeeServiceMock = {
    getAllEmployeePermissions: (email: string) =>
      of(['SEE_CLIENTS_PAGE', 'EDIT_EMPLOYEES_AUTHORITIES', 'REGISTER_A_NEW_EMPLOYEE', 'CREATE_NEW_MESSAGE']),
    updatePermissions: jasmine.createSpy('updatePermissions')
  };

  const dialogRefStub = {
    backdropClick() {
      return of();
    },
    close() {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeePermissionsFormComponent],
      imports: [CdkAccordionModule, TranslateModule.forRoot(), ReactiveFormsModule, HttpClientModule, MatCheckboxModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockedEmployee },
        { provide: UbsAdminEmployeeService, useValue: employeeServiceMock },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MatSnackBarComponent, useValue: { openSnackBar: () => {} } },
        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeePermissionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make a call to UbsAdminEmployeeService.updatePermissions with correct params', async () => {
    component.ngOnInit();
    const editEmplPermsCbDe = fixture.debugElement.query(By.css('mat-checkbox.employees-edit-authority input'));
    const seeOrdersCbDe = fixture.debugElement.query(By.css('mat-checkbox.orders-see-main-page input'));
    editEmplPermsCbDe.nativeElement.click();
    seeOrdersCbDe.nativeElement.click();

    const submitBtn = fixture.debugElement.query(By.css('.addButton'));
    submitBtn.nativeElement.click();
    expect(employeeServiceMock.updatePermissions).toHaveBeenCalledWith(mockedEmployee.email, [
      'SEE_CLIENTS_PAGE',
      'REGISTER_A_NEW_EMPLOYEE',
      'SEE_BIG_ORDER_TABLE',
      'CREATE_NEW_MESSAGE'
    ]);
  });
});
