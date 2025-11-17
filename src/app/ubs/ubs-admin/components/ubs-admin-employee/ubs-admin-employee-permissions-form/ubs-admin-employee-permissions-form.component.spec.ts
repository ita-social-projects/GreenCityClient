import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { UbsAdminEmployeePermissionsFormComponent } from './ubs-admin-employee-permissions-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

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
  let mockStore: MockStore;
  const initialState = {
    authority: {
      categories: [{ nameEn: 'fakeGroup', authorities: [{ name: 'fakePerm' }] }],
      isLoading: false,
      error: null
    }
  };
  const mockedEmployee = { id: 1, email: 'aaaa@gmail.com' };
  const employeeServiceMock = {
    getAllEmployeePermissions: (email: string) =>
      of(['SEE_CLIENTS_PAGE', 'EDIT_EMPLOYEES_AUTHORITIES', 'REGISTER_A_NEW_EMPLOYEE', 'CREATE_NEW_MESSAGE']),
    updatePermissions: jasmine.createSpy('updatePermissions')
  };
  const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
  matDialogRefMock.afterClosed.and.returnValue(of(true));
  const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
  matDialogMock.open.and.returnValue(matDialogRefMock);
  const employeePermissionsMock = ['fakePerm'];
  const ubsAdminEmployeeServiceMock = jasmine.createSpyObj('UbsAdminEmployeeService', ['getAllEmployeePermissions']);
  ubsAdminEmployeeServiceMock.getAllEmployeePermissions.and.returnValue(of(employeePermissionsMock));

  const dialogRefStub = {
    backdropClick() {
      return of();
    },
    close() {}
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeePermissionsFormComponent],
      imports: [CdkAccordionModule, TranslateModule.forRoot(), ReactiveFormsModule, HttpClientModule, MatCheckboxModule, MatDialogModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedEmployee },
        { provide: UbsAdminEmployeeService, useValue: employeeServiceMock },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MatSnackBarService, useValue: { openSnackBar: () => {} } },
        FormBuilder,
        provideMockStore({ initialState })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeePermissionsFormComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as MockStore;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable button sumbit after a form is changed', () => {
    component.updateAllComplete();
    expect(component.isDisabled).toBe(false);
  });

  it('should dispatch GetCategories action if categories are not in the store', () => {
    mockStore.setState({
      authority: {
        categories: null,
        isLoading: false,
        error: null
      }
    });
    spyOn(mockStore, 'dispatch').and.callThrough();

    component.ngOnInit();

    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith({ type: '[Authority] GetCategories' });
  });

  it('should not dispatch GetCategories action if categories are already in the store', () => {
    spyOn(mockStore, 'dispatch').and.callThrough();
    component.ngOnInit();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should call updatePermissions and close the dialog on savePermissions success', () => {
    employeeServiceMock.updatePermissions.and.returnValue(of({}));
    spyOn(component['snackBar'], 'openSnackBar');
    spyOn(component['dialogRef'], 'close');

    component.savePermissions();

    expect(employeeServiceMock.updatePermissions).toHaveBeenCalled();
    expect(component.isUpdating).toBe(false);
    expect(component['snackBar'].openSnackBar).toHaveBeenCalledWith('successUpdateUbsData');
    expect(component['dialogRef'].close).toHaveBeenCalledWith(true);
  });

  it('should call openSnackBar and close the dialog on savePermissions failure', () => {
    employeeServiceMock.updatePermissions.and.returnValue(throwError(() => ({ message: 'error' })));
    spyOn(component['snackBar'], 'openSnackBar');
    spyOn(component['dialogRef'], 'close');

    component.savePermissions();

    expect(employeeServiceMock.updatePermissions).toHaveBeenCalled();
    expect(component.isUpdating).toBe(true);
    expect(component['snackBar'].openSnackBar).toHaveBeenCalledWith('error', { message: 'error' } as any);
    expect(component['dialogRef'].close).toHaveBeenCalledWith(false);
  });

  it('should close the dialog when backdrop is clicked', () => {
    const backdropClickSubject = new Subject<void>();
    spyOn(dialogRefStub, 'backdropClick').and.returnValue(backdropClickSubject as any);
    spyOn(component['dialogRef'], 'close');

    component.ngOnInit();
    backdropClickSubject.next();

    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  it('should open the confirmation dialog on managePermissionSettings call', () => {
    spyOn(component['dialog'], 'open').and.callThrough();
    component.managePermissionSettings('cancel');

    expect(component['dialog'].open).toHaveBeenCalled();
  });

  it('should close the component dialog if the confirmation dialog is closed with true', () => {
    spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);
    spyOn(component['dialogRef'], 'close');
    component.managePermissionSettings('cancel');

    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  it('should toggle panelToggler on isPanelOpen call', () => {
    const initialValue = component.panelToggler;
    component.isPanelOpen();

    expect(component.panelToggler).toBe(!initialValue);
  });
});
