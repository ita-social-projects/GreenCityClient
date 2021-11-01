import { Component, OnDestroy, OnInit } from '@angular/core';
import { TariffsService } from '../../services/tariffs.service';
import { takeUntil } from 'rxjs/operators';
import { Locations } from '../../../main/component/ubs/models/ubs.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

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
    cross: './assets/img/ubs/cross.svg'
  };

  constructor(private tariffsService: TariffsService, private router: Router) {}

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
        this.filter();
      });
  }

  page(location) {
    this.router.navigate([`ubs-admin/tariffs/location/${location.id}`]);
  }

  getCouriers() {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Locations) => {
        this.couriers = res;
      });
  }

  filter() {
    this.locations = this.locations.filter((value) => value.locationStatus === 'ACTIVE');
    this.disabledLocations = this.disabledLocations.filter((value) => value.locationStatus === 'DEACTIVATED');
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
