import { Component, Input } from '@angular/core';
import { Page } from '../../../models/ubs-admin.interface';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { DialogPopUpComponent } from '../../shared/components/dialog-pop-up/dialog-pop-up.component';
import { take } from 'rxjs/operators';
import { UbsAdminEmployeeService } from 'src/app/ubs-admin/services/ubs-admin-employee.service';

@Component({
  selector: 'app-ubs-admin-employee-card',
  templateUrl: './ubs-admin-employee-card.component.html',
  styleUrls: ['./ubs-admin-employee-card.component.scss']
})
export class UbsAdminEmployeeCardComponent {
  @Input() data: Page;
  deleteDialogData = {
    popupTitle: 'employees.warning-title',
    popupConfirm: 'employees.btn.yes',
    popupCancel: 'employees.btn.no'
  };
  constructor(private dialog: MatDialog, private ubsAdminEmployeeService: UbsAdminEmployeeService) {}

  openModal() {
    this.dialog.open(EmployeeFormComponent, {
      data: this.data,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }

  deleteEmployee() {
    const matDialogRef = this.dialog.open(DialogPopUpComponent, {
      data: this.deleteDialogData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: ''
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.ubsAdminEmployeeService.deleteEmployee(this.data.id).subscribe();
        }
      });
  }
}
