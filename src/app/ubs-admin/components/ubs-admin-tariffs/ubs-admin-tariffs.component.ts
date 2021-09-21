import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup/ubs-admin-tariffs-add-service-popup.component';
import { UbsAdminTariffsDeletePopupComponent } from './ubs-admin-tariffs-delete-popup/ubs-admin-tariffs-delete-popup.component';

@Component({
  selector: 'app-ubs-admin-tariffs',
  templateUrl: './ubs-admin-tariffs.component.html',
  styleUrls: ['./ubs-admin-tariffs.component.scss']
})
export class UbsAdminTariffsComponent implements OnInit {
  public icons = {
    edit: './assets/img/profile/icons/edit.svg',
    delete: './assets/img/profile/icons/delete.svg'
  };
  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {}

  openAddServicePopup() {
    this.dialog.open(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'add'
      }
    });
  }

  openUpdateServicePopup() {
    this.dialog.open(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'update'
      }
    });
  }

  openDeleteProfileDialog() {
    this.dialog.open(UbsAdminTariffsDeletePopupComponent, {
      hasBackdrop: true
    });
  }
}
