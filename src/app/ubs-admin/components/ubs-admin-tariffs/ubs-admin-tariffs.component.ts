import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup/ubs-admin-tariffs-add-service-popup.component';
import { UbsAdminTariffsDeletePopupComponent } from './ubs-admin-tariffs-delete-popup/ubs-admin-tariffs-delete-popup.component';
import { TariffsService } from '../../services/tariffs.service';
import { takeUntil, take } from 'rxjs/operators';
import { Services } from '../../models/tariffs.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { OrderService } from '../../../main/component/ubs/services/order.service';
import { Locations, OrderDetails } from '../../../main/component/ubs/models/ubs.interface';

@Component({
  selector: 'app-ubs-admin-tariffs',
  templateUrl: './ubs-admin-tariffs.component.html',
  styleUrls: ['./ubs-admin-tariffs.component.scss']
})
export class UbsAdminTariffsComponent implements OnInit {
  minAmountOfBigBags: number;
  locations: Locations;
  isFetching = false;
  selectedLocationId;
  bags: Services;
  public currentLanguage: string;
  public icons = {
    edit: './assets/img/profile/icons/edit.svg',
    delete: './assets/img/profile/icons/delete.svg'
  };

  constructor(public dialog: MatDialog, private tariffsService: TariffsService, private orderService: OrderService) {}

  ngOnInit() {
    this.getAllTariffsForService();
    this.getLocations();
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

  getLocations() {
    // this.isFetching = true;
    this.orderService.getLocations().subscribe((res: Locations) => {
      this.locations = res;
      // this.selectedLocationId = this.locations[0].id;
      // this.isFetching = false;
    });
  }

  saveLocation() {
    const selectedLocation = { locationId: this.selectedLocationId };
    this.orderService
      .addLocation(selectedLocation)
      .pipe(take(1))
      .subscribe(() => {
        this.orderService.completedLocation(true);
      });
  }

  selected(event: any) {
    // const selectedLocation = { locationId: this.selectedLocationId };
    const selectedLocation = { locationId: this.selectedLocationId };
    this.orderService
      .addLocation(selectedLocation)
      .pipe(take(1))
      .subscribe(() => {
        this.orderService.completedLocation(true);
      });
    this.minbags();
  }

  minbags() {
    this.orderService.getOrders().subscribe((res) => {
      this.minAmountOfBigBags = res.minAmountOfBigBags;
      console.log(this.minAmountOfBigBags);
    });
  }
}
