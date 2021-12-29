import { Component, OnDestroy, OnInit } from '@angular/core';
import { TariffsService } from '../../services/tariffs.service';
import { takeUntil } from 'rxjs/operators';
import { Locations } from '../../models/tariffs.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UbsAdminTariffsAddLocationPopUpComponent } from './ubs-admin-tariffs-add-location-pop-up/ubs-admin-tariffs-add-location-pop-up.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UbsAdminTariffsAddCourierPopUpComponent } from './ubs-admin-tariffs-add-courier-pop-up/ubs-admin-tariffs-add-courier-pop-up.component';

@Component({
  selector: 'app-ubs-admin-tariffs-location-dashboard',
  templateUrl: './ubs-admin-tariffs-location-dashboard.component.html',
  styleUrls: ['./ubs-admin-tariffs-location-dashboard.component.scss']
})
export class UbsAdminTariffsLocationDashboardComponent implements OnInit, OnDestroy {
  locations;
  selectedLocationId;
  disabledLocations;
  couriers;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public icons = {
    edit: './assets/img/ubs-tariff/edit.svg',
    delete: './assets/img/ubs-tariff/delete.svg',
    setting: './assets/img/ubs-tariff/setting.svg'
  };

  headers = ['name', 'region', 'courier', 'locationStatus'];
  constructor(private tariffsService: TariffsService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getLocations();
    this.getCouriers();
  }

  getLocations() {
    this.tariffsService
      .getLocations()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Locations) => {
        this.locations = res;
        this.disabledLocations = res;
      });
  }

  page(location) {
    this.router.navigate([`ubs-admin/tariffs/location/${location.id}`]);
  }

  getCouriers() {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res;
      });
  }

  activateLocation(location) {
    const id = location.id;
    const languageCode = 'ua';
    this.tariffsService
      .activateLocation(id, languageCode)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getLocations());
  }

  deactivateLocation(location) {
    const id = location.id;
    const languageCode = 'ua';
    this.tariffsService
      .deactivateLocation(id, languageCode)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getLocations());
  }

  openAddLocationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    this.dialog.open(UbsAdminTariffsAddLocationPopUpComponent, dialogConfig);
  }

  openAddCourierDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    this.dialog.open(UbsAdminTariffsAddCourierPopUpComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
