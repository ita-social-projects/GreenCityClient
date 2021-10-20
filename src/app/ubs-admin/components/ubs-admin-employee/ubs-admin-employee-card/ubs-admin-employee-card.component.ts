import { Component, Input } from '@angular/core';
import { Page } from '../../../models/ubs-admin.interface';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-ubs-admin-employee-card',
  templateUrl: './ubs-admin-employee-card.component.html',
  styleUrls: ['./ubs-admin-employee-card.component.scss']
})
export class UbsAdminEmployeeCardComponent {
  @Input() data: Page;
  constructor(private dialog: MatDialog) {}

  openModal() {
    this.dialog.open(EmployeeFormComponent, {
      data: this.data,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }
}
