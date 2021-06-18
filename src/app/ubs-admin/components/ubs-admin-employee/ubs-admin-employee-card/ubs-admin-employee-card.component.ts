import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
@Component({
  selector: 'app-ubs-admin-employee-card',
  templateUrl: './ubs-admin-employee-card.component.html',
  styleUrls: ['./ubs-admin-employee-card.component.scss']
})
export class UbsAdminEmployeeCardComponent {
  @Input() data;
  constructor(public dialog: MatDialog) {}
  openDialog(
    employee = {
      image: [null],
      name: '',
      surname: '',
      phoneNumber: '',
      email: '',
      role: '',
      location: ''
    }
  ) {
    this.dialog.open(EmployeeFormComponent, {
      data: employee,
      panelClass: 'custom-modalbox'
    });
  }
  updateEmployee(data: any) {
    console.log(data.image);
    this.openDialog(data);
  }
}
