import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    { name: 'clients', permissions: [{ key: 'SEE_CLIENTS_PAGE', label: 'see-main-page' }] },
    {
      name: 'employees',
      permissions: [
        { key: 'SEE_EMPLOYEES_PAGE', label: 'see-main-page' },
        { key: 'REGISTER_A_NEW_EMPLOYEE', label: 'create-card' },
        { key: 'EDIT_EMPLOYEE', label: 'edit-card' },
        { key: 'DEACTIVATE_EMPLOYEE', label: 'delete-card' },
        { key: 'EDIT_EMPLOYEES_AUTHORITIES', label: 'edit-authority' }
      ]
    },
    {
      name: 'certificates',
      permissions: [
        { key: 'SEE_CERTIFICATES', label: 'see-main-page' },
        { key: 'CREATE_NEW_CERTIFICATE', label: 'create-card' },
        { key: 'EDIT_CERTIFICATE', label: 'edit-card' }
      ]
    },
    {
      name: 'orders',
      permissions: [
        { key: 'SEE_BIG_ORDER_TABLE', label: 'see-main-page' },
        { key: 'EDIT_ORDER', label: 'edit-card' }
      ]
    },
    {
      name: 'messages',
      permissions: [
        { key: 'SEE_MESSAGES_PAGE', label: 'see-main-page' },
        { key: 'CREATE_NEW_MESSAGE', label: 'create-card' },
        { key: 'EDIT_MESSAGE', label: 'edit-card' },
        { key: 'DELETE_MESSAGE', label: 'delete-card' }
      ]
    },
    {
      name: 'tariffs',
      permissions: [
        { key: 'SEE_TARIFFS', label: 'see-main-page' },
        { key: 'CREATE_NEW_LOCATION', label: 'create-location' },
        { key: 'CREATE_NEW_COURIER', label: 'create-courier' },
        { key: 'EDIT_LOCATION', label: 'edit-location-name' },
        { key: 'EDIT_COURIER', label: 'edit-courier-name' },
        { key: 'EDIT_DESTINATION_NAME', label: 'edit-destination-name' }, // ????????????
        { key: 'EDIT_LOCATION_CARD', label: 'create-location-card' },
        { key: 'DELETE_LOCATION_CARD', label: 'delete-location-card' }, // ????????????
        { key: 'SEE_PRICING_CARD', label: 'see-price-card' },
        { key: 'CONTROL_SERVICE', label: 'edit-service' },
        { key: 'EDIT_PRICING_CARD', label: 'edit-price-card' }
      ]
    }
  ];

  isUpdating = false;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private employeeService: UbsAdminEmployeeService
  ) {
    this.employee = data;
    this.form = this.fb.group(
      Object.fromEntries(
        this.groups.map((group) => [group.name, this.fb.group(Object.fromEntries(group.permissions.map((field) => [field.key, false])))])
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
            if (employeePermissions.includes(perm.key)) {
              this.form.get(group.name).get(perm.key).setValue(true);
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

    this.employeeService.updatePermissions(selectedPermissions).subscribe(() => {
      this.isUpdating = false;
    });
  }
}
