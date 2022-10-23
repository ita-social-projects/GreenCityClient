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

  public rights = {
    clients: ['see-main-page'],
    employees: ['see-main-page', 'create-card', 'edit-card', 'delete-card', 'edit-authority'],
    certificates: ['see-main-page', 'create-card', 'edit-card'],
    orders: ['see-main-page', 'edit-card'],
    messages: ['see-main-page', 'create-card', 'edit-card', 'delete-card'],
    tariffs: [
      'see-main-page',
      'create-location',
      'create-courier',
      'edit-location-name',
      'edit-courier-name',
      'edit-destination-name',
      'create-location-card',
      'delete-location-card',
      'see-price-card',
      'edit-service',
      'edit-price-card'
    ]
  };

  mapper = [
    ['clients-see-main-page', 'SEE_CLIENTS_PAGE'],
    ['employees-see-main-page', 'SEE_EMPLOYEES_PAGE'],
    ['employees-create-card', 'REGISTER_A_NEW_EMPLOYEE'],
    ['employees-edit-card', 'EDIT_EMPLOYEE'],
    ['employees-delete-card', 'DEACTIVATE_EMPLOYEE'],
    ['employees-edit-authority', 'EDIT_EMPLOYEES_AUTHORITIES'],
    ['certificates-see-main-page', 'SEE_CERTIFICATES'],
    ['certificates-create-card', 'CREATE_NEW_CERTIFICATE'],
    ['certificates-edit-card', 'EDIT_CERTIFICATE'],
    ['orders-see-main-page', 'SEE_BIG_ORDER_TABLE'],
    ['orders-edit-card', 'EDIT_ORDER'],
    ['messages-see-main-page', 'SEE_MESSAGES_PAGE'],
    ['messages-create-card', 'CREATE_NEW_MESSAGE'],
    ['messages-edit-card', 'EDIT_MESSAGE'],
    ['messages-delete-card', 'DELETE_MESSAGE'],
    ['tariffs-see-main-page', 'SEE_TARIFFS'],
    ['tariffs-create-location', 'CREATE_NEW_LOCATION'],
    ['tariffs-create-courier', 'CREATE_NEW_COURIER'],
    ['tariffs-edit-location-name', 'EDIT_LOCATION'],
    ['tariffs-edit-courier-name', 'EDIT_COURIER'],
    ['tariffs-edit-destination-name', 'EDIT_DESTINATION_NAME'],
    ['tariffs-create-location-card', 'EDIT_LOCATION_CARD'],
    ['tariffs-delete-location-card', 'DELETE_LOCATION_CARD'],
    ['tariffs-see-price-card', 'SEE_PRICING_CARD'],
    ['tariffs-edit-service', 'CONTROL_SERVICE'],
    ['tariffs-edit-price-card', 'EDIT_PRICING_CARD']
  ];

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private employeeService: UbsAdminEmployeeService
  ) {
    this.employee = data;

    this.form = this.fb.group(Object.fromEntries(this.mapper.map(([localKey]) => [localKey, false])));

    this.form.valueChanges.subscribe((value) => {
      // console.log(value);
    });
  }

  ngOnInit(): void {
    this.employeeService
      .getAllEmployeePermissions(this.employee.email)
      .pipe(take(1))
      .subscribe((permissions: string[]) => {
        permissions.forEach((perm) => {
          const [localKey] = this.mapper.find(([_, key]) => key === perm) ?? [];
          if (!localKey) {
            return;
          }
          this.form.get(localKey).setValue(true);
        });
      });
  }

  savePermissions() {
    const permissions = Object.entries(this.form.value)
      .filter(([, selected]) => selected)
      .map(([perm]) => {
        const [, remoteKey] = this.mapper.find(([localKey]) => localKey === perm) ?? [];
        return remoteKey;
      });

    // console.log(this.form.value);
    console.log(permissions);
    // this.employeeService.updatePermissions();
  }
}
