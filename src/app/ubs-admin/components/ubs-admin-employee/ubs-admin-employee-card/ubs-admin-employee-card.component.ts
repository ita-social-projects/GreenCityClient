import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ubs-admin-employee-card',
  templateUrl: './ubs-admin-employee-card.component.html',
  styleUrls: ['./ubs-admin-employee-card.component.scss']
})
export class UbsAdminEmployeeCardComponent {
  @Input() data;
}
