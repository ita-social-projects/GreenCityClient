import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TariffsService } from '../../services/tariffs.service';
import { takeUntil } from 'rxjs/operators';
import { Locations } from '../../models/tariffs.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormControl } from '@angular/forms';
import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up/ubs-admin-tariffs-location-pop-up.component';
import { UbsAdminTariffsAddNamePopUpComponent } from './ubs-admin-tariffs-add-name-pop-up/ubs-admin-tariffs-add-name-pop-up.component';

@Component({
  selector: 'app-ubs-admin-tariffs-location-dashboard',
  templateUrl: './ubs-admin-tariffs-location-dashboard.component.html',
  styleUrls: ['./ubs-admin-tariffs-location-dashboard.component.scss']
})
export class UbsAdminTariffsLocationDashboardComponent implements OnInit, OnDestroy {
  @Input() showTitle = true;
  @Input() locationCard: Locations;
  @Input() textBack: TemplateRef<any>;

  locations;
  selectedLocationId;
  disabledLocations;
  couriers;
  currentLanguage;
  private destroy: Subject<boolean> = new Subject<boolean>();
  panelColor = new FormControl('all');
  mainUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=';
  public icons = {
    setting: './assets/img/ubs-tariff/setting.svg',
    crumbs: './assets/img/ubs-tariff/crumbs.svg',
    restore: './assets/img/ubs-tariff/restore.svg',
    arrowDown: './assets/img/ubs-tariff/arrow-down.svg',
    arrowRight: './assets/img/ubs-tariff/arrow-right.svg'
  };

  constructor(
    private tariffsService: TariffsService,
    private router: Router,
    public dialog: MatDialog,
    private localeStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.getLocations();
    this.getCouriers();
    this.loadScript();
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
  }

  loadScript(): void {
    const script = document.getElementById('googleMaps') as HTMLScriptElement;
    if (script) {
      script.src = this.mainUrl + this.currentLanguage;
    } else {
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.setAttribute('src', this.mainUrl + this.currentLanguage);
      document.getElementsByTagName('head')[0].appendChild(google);
    }
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

  page(locationID) {
    this.router.navigate([`ubs-admin/tariffs/location/${locationID}`]);
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

  openAddCourierDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'addCourier'
    };
    this.dialog.open(UbsAdminTariffsAddNamePopUpComponent, dialogConfig);
  }

  openAddStationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'addStation'
    };
    this.dialog.open(UbsAdminTariffsAddNamePopUpComponent, dialogConfig);
  }

  openAddLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'addTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  openEditLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'editTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  openDeactivateLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'deactivateTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
