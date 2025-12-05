import { Component, OnDestroy, OnInit } from '@angular/core';
import { howWorksPickUp, courierPickUp, pricePickUp, extraoffer, minimumVolume, conditions } from './pick-up-text';
import { Store } from '@ngrx/store';
import { GetCourierLocations, GetOrderDetails } from 'src/app/store/actions/order.actions';
import { orderDetailsSelector, tariffSelector } from 'src/app/store/selectors/order.selectors';
import { filter, map, pairwise, Subject, switchMap, take, takeUntil } from 'rxjs';
import { AllActiveLocationsDtosResponse, Bag, CourierDto, LocationsName } from '@ubs/ubs/models/ubs.interface';
import { OrderService } from '@ubs/ubs/services/order.service';
import { FormControl } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
@Component({
  selector: 'app-ubs-pick-up-service-pop-up',
  templateUrl: './ubs-pick-up-service-pop-up.component.html',
  styleUrls: ['./ubs-pick-up-service-pop-up.component.scss']
})
export class UbsPickUpServicePopUpComponent implements OnInit, OnDestroy {
  courierUBS: CourierDto;
  courierUBSName = 'UBS';
  bags: Bag[];
  myControl = new FormControl();
  cities: LocationsName[] = [];
  currentLanguage: string;
  isFetching: boolean;
  private readonly destroy$ = new Subject<void>();

  howWorksPickUp = howWorksPickUp;
  courierPickUp = courierPickUp;
  pricePickUp = pricePickUp;
  extraoffer = extraoffer;
  minimumVolume = minimumVolume;
  conditions = conditions;

  constructor(
    private readonly store: Store,
    private readonly orderService: OrderService,
    private readonly localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.getActiveCouriers();
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
  }

  getActiveCouriers(): void {
    this.orderService
      .getAllActiveCouriers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((couriers) => {
        this.courierUBS = couriers.find((c) => c.nameEn === this.courierUBSName);
        if (this.courierUBS) {
          this.loadLocations();
        }
      });
  }

  loadLocations(): void {
    const courierId = this.courierUBS.courierId;
    this.orderService
      .getLocations(courierId, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: AllActiveLocationsDtosResponse) => {
        this.cities = response.allActiveLocationsDtos.reduce(
          (acc, region) => [
            ...acc,
            ...region.locations.map((city) => ({
              locationId: city.locationId,
              locationName: this.orderService.getLocationName(city, region)
            }))
          ],
          []
        );
        if (this.cities.length) {
          const defaultCity = this.cities[1];
          this.myControl.setValue(defaultCity);
          this.updateDataBasedOnLocation(defaultCity.locationId);
        }
        this.listenToLocationChanges();
      });
  }

  listenToLocationChanges(): void {
    this.myControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((city: any) => {
      this.updateDataBasedOnLocation(city.locationId);
    });
  }

  updateDataBasedOnLocation(locationId: number): void {
    const courierId = this.courierUBS.courierId;
    this.isFetching = true;
    this.store.dispatch(GetCourierLocations({ courierId, locationId }));
    this.store
      .select(tariffSelector)
      .pipe(
        pairwise(),
        filter(([prev, curr]) => curr !== prev),
        map(([, curr]) => curr),
        take(1),
        takeUntil(this.destroy$),
        switchMap((tariff) => {
          this.store.dispatch(GetOrderDetails({ locationId, tariffId: tariff.id }));
          return this.store.select(orderDetailsSelector).pipe(
            pairwise(),
            filter(([prev, curr]) => prev?.bags !== curr?.bags),
            map(([, curr]) => curr),
            take(1),
            takeUntil(this.destroy$)
          );
        })
      )
      .subscribe((orderDetails) => {
        this.bags = orderDetails.bags;
        this.isFetching = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
