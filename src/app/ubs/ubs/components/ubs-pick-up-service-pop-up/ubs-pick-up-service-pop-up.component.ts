import { Component, OnDestroy, OnInit } from '@angular/core';
import { conditions, courierPickUp, extraoffer, howWorksPickUp, minimumVolume, pricePickUp } from './pick-up-text';
import { Store } from '@ngrx/store';
import { GetOrderDetails } from 'src/app/store/actions/order.actions';
import { orderDetailsSelector } from 'src/app/store/selectors/order.selectors';
import { distinctUntilChanged, filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ActiveTariffInfo, Bag, CourierDto, OrderDetails } from '@ubs/ubs/models/ubs.interface';
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
  myControl = new FormControl<ActiveTariffInfo>(null);
  tariffs: ActiveTariffInfo[] = [];
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
    protected readonly orderService: OrderService,
    private readonly store: Store,
    private readonly localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.getActiveTariffs();
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
  }

  getActiveTariffs(): void {
    this.orderService
      .getAllActiveCouriers()
      .pipe(
        map((couriers) => {
          this.courierUBS = couriers.find((c) => c.nameEn === this.courierUBSName);
          return this.courierUBS;
        }),
        switchMap(() => this.orderService.getActiveTariffsInfo())
      )
      .subscribe((tariffs: ActiveTariffInfo[]) => {
        this.tariffs = tariffs;
        this.listenToLocationChanges();
        const userTariff = this.localStorageService.getTariffId() || tariffs[0].id;
        this.myControl.setValue(tariffs.find((t) => t.id === userTariff));
      });
  }

  listenToLocationChanges(): void {
    this.myControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap((tariff: ActiveTariffInfo) => {
          this.isFetching = true;
          this.store.dispatch(GetOrderDetails({ tariffId: tariff.id }));
        }),
        switchMap(() => this.store.select(orderDetailsSelector)),
        tap(() => (this.isFetching = false)),
        filter(Boolean),
        takeUntil(this.destroy$)
      )
      .subscribe((orderDetails: OrderDetails) => (this.bags = orderDetails.bags));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
