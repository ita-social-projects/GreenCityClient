import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsAdminEmployeeEditFormComponent } from './ubs-admin-employee-edit-form/ubs-admin-employee-edit-form.component';
import { UbsAdminEmployeeService } from '../../services/ubs-admin-employee.service';

@Component({
  selector: 'app-ubs-admin-employee',
  templateUrl: './ubs-admin-employee.component.html',
  styleUrls: ['./ubs-admin-employee.component.scss']
})
export class UbsAdminEmployeeComponent {
  public icons = {
    filter: './assets/img/ubs-admin-employees/filter.svg'
  };

  constructor(public dialog: MatDialog, private ubsAdminEmployeeService: UbsAdminEmployeeService) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ubsAdminEmployeeService.searchValue.next(filterValue.trim().toLowerCase());
  }

  openDialog() {
    this.dialog.open(UbsAdminEmployeeEditFormComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'admin-cabinet-dialog-container'
    });
  }
}
