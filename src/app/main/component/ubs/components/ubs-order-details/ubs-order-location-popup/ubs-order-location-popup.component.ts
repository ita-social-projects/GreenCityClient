import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
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
  public locations: Locations[];
  public selectedLocationId: number;
  public isFetching = false;
  private currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public currentLocation: string;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<UbsOrderLocationPopupComponent>,
    private localStorageService: LocalStorageService
  ) {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.getLocations();
  }

  redirectToMain() {
    this.router.navigate(['ubs']);
  }

  private setCurrentLocation(currentLanguage: string): void {
    this.currentLocation = this.locations.find((loc) => loc.id === this.selectedLocationId && loc.languageCode === currentLanguage).name;
  }

  getLocations() {
    this.isFetching = true;
    this.orderService
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
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
        this.localStorageService.setLocationId(this.selectedLocationId);
        this.localStorageService.setLocations(this.locations);
        this.setCurrentLocation(this.currentLanguage);
        this.orderService.setLocationData(this.currentLocation);
      });
  }

  passDataToComponent() {
    this.dialogRef.close({ locationId: this.selectedLocationId, currentLanguage: this.currentLanguage, data: this.locations });
  }

  ngOnDestroy() {
    this.passDataToComponent();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
