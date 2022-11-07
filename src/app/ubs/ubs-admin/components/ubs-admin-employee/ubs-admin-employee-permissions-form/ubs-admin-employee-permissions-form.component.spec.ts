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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeePermissionsFormComponent],
      imports: [CdkAccordionModule, TranslateModule.forRoot(), ReactiveFormsModule, HttpClientModule, MatCheckboxModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockedEmployee },
        { provide: UbsAdminEmployeeService, useValue: employeeServiceMock },
        { provide: MatDialogRef, useValue: { close: () => {} } },
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

  it('should load all permissions correctly', async () => {
    component.ngOnInit();
    const seeClientPageCbDe = fixture.debugElement.query(By.css('mat-checkbox.clients-see-main-page input'));
    const editEmplPermsCbDe = fixture.debugElement.query(By.css('mat-checkbox.employees-edit-authority input'));
    const createEmplCbDe = fixture.debugElement.query(By.css('mat-checkbox.employees-create-card input'));
    const createMessageCbDe = fixture.debugElement.query(By.css('mat-checkbox.messages-create-card input'));
    expect(seeClientPageCbDe.nativeElement.checked).toBeTruthy();
    expect(editEmplPermsCbDe.nativeElement.checked).toBeTruthy();
    expect(createEmplCbDe.nativeElement.checked).toBeTruthy();
    expect(createMessageCbDe.nativeElement.checked).toBeTruthy();
  });

  it('should make a call to UbsAdminEmployeeService.updatePermissions with correct params', async () => {
    component.ngOnInit();
    const editEmplPermsCbDe = fixture.debugElement.query(By.css('mat-checkbox.employees-edit-authority input'));
    const seeOrdersCbDe = fixture.debugElement.query(By.css('mat-checkbox.orders-see-main-page input'));
    editEmplPermsCbDe.nativeElement.click();
    seeOrdersCbDe.nativeElement.click();

    const submitBtn = fixture.debugElement.query(By.css('.addButton'));
    submitBtn.nativeElement.click();
    expect(employeeServiceMock.updatePermissions).toHaveBeenCalledWith(1, [
      'SEE_CLIENTS_PAGE',
      'REGISTER_A_NEW_EMPLOYEE',
      'SEE_BIG_ORDER_TABLE',
      'CREATE_NEW_MESSAGE'
    ]);
  });
});
