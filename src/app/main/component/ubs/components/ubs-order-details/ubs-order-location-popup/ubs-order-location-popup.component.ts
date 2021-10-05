import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Locations } from '../../../models/ubs.interface';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit, OnDestroy {
  closeButton = './assets/img/profile/icons/cancel.svg';
  locations: Locations;
  selectedLocationId;
  isFetching = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router, private orderService: OrderService, public dialogRef: MatDialogRef<UbsOrderLocationPopupComponent>) {}

  ngOnInit(): void {
    this.getLocations();
  }

  redirectToMain() {
    this.router.navigate(['ubs']);
  }

  getLocations() {
    this.isFetching = true;
    this.orderService
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: Locations) => {
        this.locations = res;
        this.selectedLocationId = this.locations[0].id;
        this.isFetching = false;
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

  passDataToComponent() {
    this.dialogRef.close({ data: this.locations });
  }

  ngOnDestroy() {
    this.passDataToComponent();
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
