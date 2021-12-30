import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CourierLocations, LocationTranslation } from '../../../models/ubs.interface';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit, OnDestroy {
  closeButton = './assets/img/profile/icons/cancel.svg';
  public locations: CourierLocations[];
  public selectedLocationId: number;
  public isFetching = false;
  private courierId = 1;
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
    this.currentLocation = this.locations
      .find((loc: CourierLocations) => loc.locationsDtos[0].locationId === this.selectedLocationId)
      .locationsDtos[0].locationTranslationDtoList.find((lang: LocationTranslation) => lang.languageCode === currentLanguage).locationName;
  }

  getLocations() {
    this.isFetching = true;
    this.orderService
      .getLocations(this.courierId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: CourierLocations[]) => {
        this.locations = res;
        this.selectedLocationId = res[0].courierLocationId;
        this.isFetching = false;
      });
  }

  saveLocation() {
    this.orderService.completedLocation(true);
    this.localStorageService.setLocationId(this.selectedLocationId);
    this.localStorageService.setLocations(this.locations);
    this.setCurrentLocation(this.currentLanguage);
    this.orderService.setLocationData(this.currentLocation);
  }

  passDataToComponent() {
    this.dialogRef.close({ locationId: this.selectedLocationId, currentLanguage: this.currentLanguage, data: this.locations });
  }

  changeLocation(id: number): void {
    this.selectedLocationId = id;
  }

  ngOnDestroy() {
    this.passDataToComponent();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
