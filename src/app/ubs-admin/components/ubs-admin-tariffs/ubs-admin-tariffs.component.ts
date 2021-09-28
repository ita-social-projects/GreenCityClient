import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup/ubs-admin-tariffs-add-service-popup.component';
import { UbsAdminTariffsDeletePopupComponent } from './ubs-admin-tariffs-delete-popup/ubs-admin-tariffs-delete-popup.component';
import { TariffsService } from '../../services/tariffs.service';
import { takeUntil } from 'rxjs/operators';
import { Services } from '../../models/tariffs.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-ubs-admin-tariffs',
  templateUrl: './ubs-admin-tariffs.component.html',
  styleUrls: ['./ubs-admin-tariffs.component.scss']
})
export class UbsAdminTariffsComponent implements OnInit {
  bags: Services;
  public currentLanguage: string;
  public icons = {
    edit: './assets/img/profile/icons/edit.svg',
    delete: './assets/img/profile/icons/delete.svg'
  };

  constructor(public dialog: MatDialog, private tariffsService: TariffsService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.getAllTariffsForService();
  }

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

  getAllTariffsForService() {
    this.tariffsService
      .getAllTariffsService()
      // .pipe(takeUntil(this.destroy))
      .subscribe((res: Services) => {
        this.bags = res;
        console.log(this.bags);
      });
  }
}
