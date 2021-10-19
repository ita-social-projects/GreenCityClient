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
  locations: Locations;
  selectedLocationId;
  couriers;
  private destroy: Subject<boolean> = new Subject<boolean>();

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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
