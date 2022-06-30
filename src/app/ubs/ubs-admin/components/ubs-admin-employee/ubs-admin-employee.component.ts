import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

@Component({
  selector: 'app-ubs-admin-employee',
  templateUrl: './ubs-admin-employee.component.html',
  styleUrls: ['./ubs-admin-employee.component.scss']
})
export class UbsAdminEmployeeComponent {
  public icons = {
    filter: './assets/img/ubs-admin-employees/filter.svg'
  };

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(EmployeeFormComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }
}
