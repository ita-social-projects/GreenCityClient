import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { UbsAdminEmployeePermissionsFormComponent } from './ubs-admin-employee-permissions-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

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
      imports: [CdkAccordionModule, TranslateModule.forRoot(), ReactiveFormsModule, HttpClientModule, MatCheckboxModule, MatDialogModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
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

  it('should handle error during permission update', () => {
    const errorMessage = 'Error occurred';
    employeeServiceMock.updatePermissions.and.returnValue(throwError(errorMessage));
    component.savePermissions();
    expect(component.isUpdating).toBe(true);
    expect(employeeServiceMock.updatePermissions).toHaveBeenCalledWith(mockedEmployee.email, [
      'SEE_CLIENTS_PAGE',
      'REGISTER_A_NEW_EMPLOYEE',
      'EDIT_EMPLOYEES_AUTHORITIES',
      'CREATE_NEW_MESSAGE'
    ]);
    expect(component.isUpdating).toBe(true);
  });

  it('should enable button sumbit after a form is changed', () => {
    component.updateAllComplete();
    expect(component.isDisabled).toBe(false);
  });
});
