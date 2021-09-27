import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Locations } from '../../../models/ubs.interface';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  locations: Locations;
  selectedLocationId;
  isFetching = false;

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.getLocations();
  }

  redirectToMain() {
    this.router.navigate(['ubs']);
  }

  getLocations() {
    this.isFetching = true;
    this.orderService.getLocations().subscribe((res: Locations) => {
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
}
