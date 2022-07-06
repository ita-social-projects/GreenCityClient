import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ubs-admin-employee-rights-form',
  templateUrl: './ubs-admin-employee-rights-form.component.html',
  styleUrls: ['./ubs-admin-employee-rights-form.component.scss']
})
export class UbsAdminEmployeeRightsFormComponent {
  public rights = [
    {
      key: 'clients',
      fields: ['see-main-page']
    },
    {
      key: 'employees',
      fields: ['see-main-page', 'create-card', 'edit-card', 'delete-card', 'edit-authority']
    },
    {
      key: 'certificates',
      fields: ['see-main-page', 'create-card', 'edit-card']
    },
    {
      key: 'orders',
      fields: ['see-main-page', 'edit-card']
    },
    {
      key: 'messages',
      fields: ['see-main-page', 'create-card', 'edit-card', 'delete-card']
    },
    {
      key: 'tariffs',
      fields: [
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
    }
  ];

  constructor(public translate: TranslateService) {}
}
