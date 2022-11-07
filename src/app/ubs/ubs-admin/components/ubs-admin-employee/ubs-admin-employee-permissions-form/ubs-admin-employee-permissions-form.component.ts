import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { Page } from '../../../models/ubs-admin.interface';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';

@Component({
  selector: 'app-ubs-admin-employee-permissions-form',
  templateUrl: './ubs-admin-employee-permissions-form.component.html',
  styleUrls: ['./ubs-admin-employee-permissions-form.component.scss']
})
export class UbsAdminEmployeePermissionsFormComponent implements OnInit {
  form: FormGroup;
  employee: Page;

  public groups = [
    { name: 'clients', permissions: ['SEE_CLIENTS_PAGE'] },
    {
      name: 'employees',
      permissions: ['SEE_EMPLOYEES_PAGE', 'REGISTER_A_NEW_EMPLOYEE', 'EDIT_EMPLOYEE', 'DEACTIVATE_EMPLOYEE', 'EDIT_EMPLOYEES_AUTHORITIES']
    },
    {
      name: 'certificates',
      permissions: ['SEE_CERTIFICATES', 'CREATE_NEW_CERTIFICATE', 'EDIT_CERTIFICATE']
    },
    {
      name: 'orders',
      permissions: ['SEE_BIG_ORDER_TABLE', 'EDIT_ORDER']
    },
    {
      name: 'messages',
      permissions: ['SEE_MESSAGES_PAGE', 'CREATE_NEW_MESSAGE', 'EDIT_MESSAGE', 'DELETE_MESSAGE']
    },
    {
      name: 'tariffs',
      permissions: [
        'SEE_TARIFFS',
        'CREATE_NEW_LOCATION',
        'EDIT_COURIER',
        'EDIT_DESTINATION_NAME', // ????????????
        'EDIT_LOCATION_CARD',
        'DELETE_LOCATION_CARD', // ????????????
        'SEE_PRICING_CARD',
        'CONTROL_SERVICE'
      ]
    }
  ];

  labels = {
    SEE_CLIENTS_PAGE: 'see-main-page',
    SEE_EMPLOYEES_PAGE: 'see-main-page',
    REGISTER_A_NEW_EMPLOYEE: 'create-card',
    EDIT_EMPLOYEE: 'edit-card',
    DEACTIVATE_EMPLOYEE: 'delete-card',
    EDIT_EMPLOYEES_AUTHORITIES: 'edit-authority',
    SEE_CERTIFICATES: 'see-main-page',
    CREATE_NEW_CERTIFICATE: 'create-card',
    EDIT_CERTIFICATE: 'edit-card',
    SEE_BIG_ORDER_TABLE: 'see-main-page',
    EDIT_ORDER: 'edit-card',
    SEE_MESSAGES_PAGE: 'see-main-page',
    CREATE_NEW_MESSAGE: 'create-card',
    EDIT_MESSAGE: 'edit-card',
    DELETE_MESSAGE: 'delete-card',
    SEE_TARIFFS: 'see-main-page',
    CREATE_NEW_LOCATION: 'create-location',
    CREATE_NEW_COURIER: 'create-courier',
    EDIT_LOCATION: 'edit-location-name',
    EDIT_COURIER: 'edit-courier-name',
    EDIT_DESTINATION_NAME: 'edit-destination-name',
    EDIT_LOCATION_CARD: 'create-location-card',
    DELETE_LOCATION_CARD: 'delete-location-card',
    SEE_PRICING_CARD: 'see-price-card',
    CONTROL_SERVICE: 'edit-service',
    EDIT_PRICING_CARD: 'edit-price-card'
  };

  isUpdating = false;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private employeeService: UbsAdminEmployeeService,
    private dialogRef: MatDialogRef<UbsAdminEmployeePermissionsFormComponent>,
    private snackBar: MatSnackBarComponent
  ) {
    this.employee = data;
    this.form = this.fb.group(
      Object.fromEntries(
        this.groups.map((group) => [group.name, this.fb.group(Object.fromEntries(group.permissions.map((field) => [field, false])))])
      )
    );
  }

  ngOnInit(): void {
    this.employeeService
      .getAllEmployeePermissions(this.employee.email)
      .pipe(take(1))
      .subscribe((employeePermissions: string[]) => {
        this.groups.forEach((group) => {
          group.permissions.forEach((perm) => {
            if (employeePermissions.includes(perm)) {
              this.form.get(group.name).get(perm).setValue(true);
            }
          });
        });
      });
  }

  savePermissions() {
    this.isUpdating = true;
    const selectedPermissions = Object.entries(this.form.value)
      .flatMap(([, perm]) => Object.entries(perm))
      .filter(([, selected]) => selected)
      .map(([perm]) => perm);

    this.employeeService.updatePermissions(this.employee.id, selectedPermissions).subscribe(
      () => {
        this.isUpdating = false;
        this.dialogRef.close(true);
      },
      (error) => {
        this.snackBar.openSnackBar('error', error);
        this.dialogRef.close(false);
      }
    );
  }
}
