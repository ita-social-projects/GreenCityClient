import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { ActiveTariffInfo, CourierLocations } from '../../../models/ubs.interface';
import { OrderService } from '../../../services/order.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { SetTariff } from '../../../../../store/actions/order.actions';

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit, OnDestroy {
  closeButton = './assets/img/profile/icons/cancel.svg';
  activeTariffs: ActiveTariffInfo[] = [];
  selectedTariff: ActiveTariffInfo;
  isFetching = false;
  myControl = new FormControl(null, Validators.required);
  private locationsForTariff: CourierLocations;
  private readonly currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly orderService: OrderService,
    private readonly dialogRef: MatDialogRef<UbsOrderLocationPopupComponent>,
    private readonly localStorageService: LocalStorageService,
    private readonly store: Store
  ) {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.orderService.getActiveTariffsInfo().subscribe((res) => {
      this.activeTariffs = res;
      const tariffId = this.localStorageService.getTariffId();
      this.selectedTariff = res.find((tariff) => tariff.id === tariffId) || res[0];
      this.myControl.setValue(this.selectedTariff);
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

  saveLocation(): void {
    this.localStorageService.setTariffId(this.selectedTariff.id);
    this.store.dispatch(SetTariff({ tariff: this.selectedTariff }));
    this.passDataToComponent();
  }

  changeTariff(tariff: ActiveTariffInfo): void {
    this.selectedTariff = tariff;
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  passDataToComponent(): void {
    this.dialogRef.close({
      tariff: this.selectedTariff.id,
      currentLanguage: this.currentLanguage,
      data: this.locationsForTariff,
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
