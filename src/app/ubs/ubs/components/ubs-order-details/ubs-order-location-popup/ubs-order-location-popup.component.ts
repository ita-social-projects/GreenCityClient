import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { CourierLocations, LocationTranslation, LocationsName } from '../../../models/ubs.interface';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit, OnDestroy {
  closeButton = './assets/img/profile/icons/cancel.svg';
  public locations: CourierLocations[];
  public cities: LocationsName[];
  public selectedLocationId: number;
  public isFetching = false;
  public isSaveLocation: boolean;
  private courierId = 1;
  private currentLanguage: string;
  public currentLocation: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public myControl = new FormControl();
  public filteredOptions: Observable<any>;

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
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.locationName)),
      map((locationName) => (locationName ? this._filter(locationName) : this.cities.slice()))
    );
  }

  displayFn(city: LocationsName): string {
    return city && city.locationName ? city.locationName : '';
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.cities.filter((option) => option.locationName.toLowerCase().includes(filterValue));
  }

  redirectToMain() {
    this.isSaveLocation = false;
  }

  private setCurrentLocation(currentLanguage: string): void {
    this.currentLocation = this.locations
      .find((loc: CourierLocations) => loc.locationInfoDtos[0].locationsDto[0].locationId === this.selectedLocationId)
      .locationInfoDtos[0].locationsDto[0].locationTranslationDtoList.find(
        (lang: LocationTranslation) => lang.languageCode === currentLanguage
      ).locationName;
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
        this.cities = this.locations.map((location) => ({
          locationId: location.locationInfoDtos[0].locationsDto[0].locationId,
          locationName: location.locationInfoDtos[0].locationsDto[0].locationTranslationDtoList.filter(
            (item) => item.languageCode === this.currentLanguage
          )[0].locationName
        }));
      });
  }

  saveLocation() {
    this.isSaveLocation = true;
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
    if (this.isSaveLocation) {
      this.passDataToComponent();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
