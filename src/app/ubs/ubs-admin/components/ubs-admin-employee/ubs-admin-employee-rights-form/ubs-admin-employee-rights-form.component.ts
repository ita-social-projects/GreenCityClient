import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { Page } from '../../../models/ubs-admin.interface';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';

@Component({
  selector: 'app-ubs-admin-employee-rights-form',
  templateUrl: './ubs-admin-employee-rights-form.component.html',
  styleUrls: ['./ubs-admin-employee-rights-form.component.scss']
})
export class UbsAdminEmployeeRightsFormComponent implements OnInit {
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
        'CREATE_NEW_COURIER',
        'EDIT_LOCATION',
        'EDIT_COURIER',
        'EDIT_DESTINATION_NAME', // ????????????
        'EDIT_LOCATION_CARD',
        'DELETE_LOCATION_CARD', // ????????????
        'SEE_PRICING_CARD',
        'CONTROL_SERVICE',
        'EDIT_PRICING_CARD'
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private employeeService: UbsAdminEmployeeService
  ) {
    this.employee = data;

    this.form = this.fb.group(
      Object.fromEntries(
        this.groups.map((group) => [group.name, this.fb.group(Object.fromEntries(group.permissions.map((field) => [field, false])))])
      )
    );
  }

  initForm(): void {
    Object.fromEntries(
      this.groups.map((group) => {
        const { name, permissions } = group;
        const formGroup = this.fb.group(Object.fromEntries(permissions.map((field) => [field, false])));
        return [name, formGroup];
      })
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
    const selectedPermissions = Object.entries(this.form.value)
      .flatMap(([, perm]) => Object.entries(perm))
      .filter(([, selected]) => selected)
      .map(([perm]) => perm);

    this.employeeService.updatePermissions(selectedPermissions);
  }
}
