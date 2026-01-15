import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { map, Observable, Subject } from 'rxjs';
import { ActiveTariffInfo } from '../../../models/ubs.interface';
import { OrderService } from '../../../services/order.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { finalize, startWith, takeUntil } from 'rxjs/operators';
import { LanguageService } from '../../../../../shared/i18n/language.service';

@Component({
  selector: 'app-ubs-order-location-popup',
  templateUrl: './ubs-order-location-popup.component.html',
  styleUrls: ['./ubs-order-location-popup.component.scss']
})
export class UbsOrderLocationPopupComponent implements OnInit, OnDestroy {
  closeButton = './assets/img/profile/icons/cancel.svg';
  activeTariffs: ActiveTariffInfo[] = [];
  selectedTariff: ActiveTariffInfo;
  filteredOptions$: Observable<ActiveTariffInfo[]>;
  isFetching = false;
  myControl = new FormControl(null, Validators.required);
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly orderService: OrderService,
    private readonly dialogRef: MatDialogRef<UbsOrderLocationPopupComponent>,
    private readonly localStorageService: LocalStorageService,
    private readonly store: Store,
    private readonly langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.orderService
      .getActiveTariffsInfo()
      .pipe(finalize(() => (this.isFetching = false)))
      .subscribe((res: ActiveTariffInfo[]) => {
        this.activeTariffs = res;
        const tariffId = this.localStorageService.getTariffId();
        this.selectedTariff = res.find((tariff) => tariff.id === tariffId) || res[0];
        this.myControl.setValue(this.selectedTariff);
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value) => {
            const search = typeof value === 'string' ? value : this.getTariffName(value);

            return this.activeTariffs.filter(
              (tariff) =>
                tariff.tariffLocations.some((t) => t.nameEn.toLowerCase().includes(search.toLowerCase())) ||
                tariff.tariffLocations.some((t) => t.nameUk.toLowerCase().includes(search.toLowerCase())) ||
                tariff.tariffNameEn.toLowerCase().includes(search.toLowerCase()) ||
                tariff.tariffNameUk.toLowerCase().includes(search.toLowerCase())
            );
          }),
          takeUntil(this.destroy$)
        );
      });
  }

  displayFn = (tariff: ActiveTariffInfo): string => {
    return tariff ? this.getTariffName(tariff) : '';
  };

  getTariffName(tariff: ActiveTariffInfo): string {
    return this.orderService.getTariffName(tariff) || '';
  }

  getTariffLocations(tariff: ActiveTariffInfo): string {
    return (
      tariff.tariffLocations
        .slice()
        .sort((a, b) => this.langService.getLangValue(a.nameUk, a.nameEn).localeCompare(this.langService.getLangValue(b.nameUk, b.nameEn)))
        .map((location) => this.langService.getLangValue(location.nameUk, location.nameEn))
        .join(', ') ?? ''
    );
  }

  saveLocation(): void {
    this.localStorageService.setTariffId(this.selectedTariff.id);
    this.dialogRef.close(this.selectedTariff);
  }

  changeTariff(tariff: ActiveTariffInfo): void {
    this.selectedTariff = tariff;
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  closePopUp(): void {
    this.dialogRef.close();
  }

  clearInput(): void {
    this.myControl.reset('');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
