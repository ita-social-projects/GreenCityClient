import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../../main/component/ubs/services/order.service';
import { take, takeUntil } from 'rxjs/operators';
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
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.getLocations();
  }

  getLocations() {
    this.orderService
      .getLocations()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Locations) => {
        this.locations = res;
      });
  }

  page(location) {
    this.router.navigate([`ubs-admin/tariffs/location/${location.id}`]);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
