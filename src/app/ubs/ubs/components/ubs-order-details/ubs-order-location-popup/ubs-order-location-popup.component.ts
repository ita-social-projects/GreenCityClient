import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject, Observable, of, iif } from 'rxjs';
import { takeUntil, startWith, map, mergeMap } from 'rxjs/operators';
import { CourierLocations, AllLocationsDtos, LocationsName } from '../../../models/ubs.interface';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit, OnDestroy {
  closeButton = './assets/img/profile/icons/cancel.svg';
  public locations: CourierLocations;
  public cities: LocationsName[];
  public selectedLocationId: number;
  public isFetching = false;
  private currentLanguage: string;
  public currentLocation: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public myControl = new FormControl();
  public filteredOptions: Observable<any>;

  constructor(
    private orderService: OrderService,
    private dialogRef: MatDialogRef<UbsOrderLocationPopupComponent>,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
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
    this.myControl.setValidators(Validators.required);
  }

  displayFn(city: LocationsName): string {
    return city && city.locationName ? city.locationName : '';
  }

  private _filter(value: string): LocationsName[] {
    this.currentLocation = null;

    const filterValue = value.toLowerCase();
    return this.cities.filter((option) => option.locationName.toLowerCase().includes(filterValue));
  }

  getLocations(): void {
    this.isFetching = true;
    of(true)
      .pipe(
        takeUntil(this.destroy$),
        mergeMap(() => iif(() => this.data, of(this.data), this.orderService.getLocations(true)))
      )
      .subscribe((res: AllLocationsDtos) => {
        this.isFetching = false;

        this.cities = res.allActiveLocationsDtos.reduce(
          (acc, region) => [
            ...acc,
            ...region.locations.map((city) => ({
              locationId: city.locationId,
              locationName: this.currentLanguage === 'ua' ? `${city.nameUk}, ${region.nameUk}` : `${city.nameEn}, ${region.nameEn}`
            }))
          ],
          []
        );
      });
  }

  saveLocation(): void {
    this.orderService
      .getInfoAboutTariff(this.selectedLocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: AllLocationsDtos) => {
        if (res.orderIsPresent) {
          this.locations = res.tariffsForLocationDto;
          this.selectedLocationId = res.tariffsForLocationDto.locationsDtosList[0].locationId;
          this.localStorageService.setLocationId(this.selectedLocationId);
          this.localStorageService.setLocations(this.locations);
          this.orderService.setLocationData(this.currentLocation);
          this.orderService.completedLocation(true);
          this.passDataToComponent();
        }
      });
  }

  passDataToComponent(): void {
    this.dialogRef.close({ locationId: this.selectedLocationId, currentLanguage: this.currentLanguage, data: this.locations });
  }

  changeLocation(id: number, locationName: string): void {
    this.selectedLocationId = id;
    this.currentLocation = locationName.split(',')[0];
  }

  public redirectToUbsPage(): void {
    if (!this.selectedLocationId) {
      this.router.navigate(['/ubs']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
