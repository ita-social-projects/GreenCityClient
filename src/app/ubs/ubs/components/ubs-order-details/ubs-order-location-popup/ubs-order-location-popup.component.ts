import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { ActiveTariffInfo, CourierLocations } from '../../../models/ubs.interface';
import { OrderService } from '../../../services/order.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit, OnDestroy {
  closeButton = './assets/img/profile/icons/cancel.svg';
  activeTariffs: ActiveTariffInfo[] = [];
  selectedTariffId: number;
  isFetching = false;
  myControl = new FormControl(null, Validators.required);
  private locationForTariffs: CourierLocations;
  private readonly currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly orderService: OrderService,
    private readonly dialogRef: MatDialogRef<UbsOrderLocationPopupComponent>,
    private readonly localStorageService: LocalStorageService,
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.getActiveTariffs();
  }

  getActiveTariffs() {
    this.orderService.getActiveTariffsInfo().subscribe((res) => {
      this.activeTariffs = res;
      this.selectedTariffId = this.localStorageService.getLocationId() || 0;
      const tariffName = res.find((tariff) => tariff.id === this.selectedTariffId);
      this.myControl.setValue(tariffName, { emitEvent: false });
    });
  }

  displayFn = (tariff: ActiveTariffInfo): string => {
    return tariff ? this.getTariffName(tariff) : '';
  };

  getTariffName(tariff: ActiveTariffInfo): string {
    return this.orderService.getTariffName(tariff) || '';
  }

  getTariffDescription(tariffId: number): string | null {
    const tariff = this.activeTariffs.find((t) => t.id === tariffId);
    return tariff ? this.orderService.getTariffDescription(tariff) : null;
  }

  // saveLocation(): void {
  //   this.store.dispatch(
  //     GetCourierLocations({
  //       courierId: this.courierUBS.courierId,
  //       locationId: this.selectedLocationId
  //     })
  //   );
  //   this.orderService
  //     .getInfoAboutTariff(this.courierUBS.courierId, this.selectedLocationId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((res: AllLocationsDtos) => {
  //       if (res.orderIsPresent) {
  //         this.locations = res.tariffsForLocationDto;
  //         res.tariffsForLocationDto.locationsDtosList.forEach((location) => {
  //           if (location.nameEn === this.currentLocation) {
  //             this.selectedLocationId = location.locationId;
  //           }
  //         });
  //         this.selectedTariffId = res.tariffsForLocationDto.tariffInfoId;
  //         this.store.dispatch(
  //           GetOrderDetails({
  //             locationId: this.selectedLocationId,
  //             tariffId: this.selectedTariffId
  //           })
  //         );
  //         this.localStorageService.setLocationId(this.selectedLocationId);
  //         this.localStorageService.setTariffId(this.selectedTariffId);
  //         this.localStorageService.setLocations(this.locations);
  //         this.orderService.setLocationData(this.currentLocation);
  //         this.orderService.completedLocation(true);
  //         this.passDataToComponent();
  //       }
  //     });
  // }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  passDataToComponent(): void {
    this.dialogRef.close({
      tariff: this.selectedTariffId,
      currentLanguage: this.currentLanguage,
      data: this.locationForTariffs,
      activeTariffs: this.activeTariffs
    });
  }

  closePopUp(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
