import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TariffsService } from '../../../services/tariffs.service';
import { Locations, LocationDto, SelectedItems, Couriers, Stations, TariffCard } from '../../../models/tariffs.interface';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { TranslateService } from '@ngx-translate/core';
import { TariffDeactivateConfirmationPopUpComponent } from '../../shared/components/tariff-deactivate-confirmation-pop-up/tariff-deactivate-confirmation-pop-up.component';

@Component({
  selector: 'app-ubs-admin-tariffs-deactivate-pop-up',
  templateUrl: './ubs-admin-tariffs-deactivate-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-deactivate-pop-up.component.scss']
})
export class UbsAdminTariffsDeactivatePopUpComponent implements OnInit, OnDestroy {
  CardForm = this.fb.group({
    courier: [''],
    station: [''],
    region: [''],
    city: [{ value: '', disabled: true }]
  });
  public icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg',
    cross: '././assets/img/ubs/cross.svg'
  };
  public name: string;
  public datePipe = new DatePipe('ua');
  public newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  unsubscribe: Subject<any> = new Subject();

  public couriers: Couriers[];
  public couriersName: Array<string>;
  public filteredCouriers: Array<string>;
  public locations: Locations[];
  public filteredRegions: Array<string>;
  public regionsName: Array<string>;
  public selectedRegions: SelectedItems[] = [];
  public selectedRegionsLength: number;
  public regionPlaceholder: string;
  public stations: Stations[];
  public stationsName: Array<string>;
  public filteredStations: Array<string>;
  public selectedStations: SelectedItems[] = [];
  public stationPlaceholder: string;
  public currentCities: LocationDto[] = [];
  public filteredCities: Array<string> = [];
  public selectedCities: SelectedItems[] = [];
  public currentCitiesName: Array<string> = [];
  public cityPlaceholder: string;
  public selectedCityLength: number;
  public selectedCourier: SelectedItems;
  public tariffCards: TariffCard[] = [];
  public deactivateCardObj;

  constructor(
    private fb: FormBuilder,
    private localeStorage: LocalStorageService,
    private tariffsService: TariffsService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsDeactivatePopUpComponent>
  ) {}

  get courier() {
    return this.CardForm.get('courier');
  }
  get station() {
    return this.CardForm.get('station');
  }
  get region() {
    return this.CardForm.get('region');
  }
  get city() {
    return this.CardForm.get('city');
  }

  ngOnInit(): void {
    this.localeStorage.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((name) => {
      this.name = name;
    });
    this.setStationPlaceholder();
    this.setRegionsPlaceholder();
    this.setCityPlaceholder();
    setTimeout(() => this.city.disable());
    this.getCouriers();
    this.getReceivingStation();
    this.getLocations();
    this.getTariffCards();
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: Couriers[]) => {
        this.couriers = res;
        this.couriersName = this.couriers.map((it) => it.courierTranslationDtos.map((el) => el.name)).flat(2);
        this.courier.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this.filterOptions(value, this.couriersName))
          )
          .subscribe((data) => {
            this.filteredCouriers = data;
            if (!this.courier.value) {
              this.station.enable();
              this.region.enable();
              this.selectedCourier = null;
            }
            if (!data.length) {
              this.courier.setErrors({ invalid: true });
            }
          });
      });
  }

  public getReceivingStation(): void {
    this.tariffsService
      .getAllStations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: Stations[]) => {
        this.stations = res;
        this.stationsName = this.stations.map((it) => it.name);
        this.station.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this.filterOptions(value, this.stationsName))
          )
          .subscribe((data) => {
            this.filteredStations = data;
            if (!data.length) {
              this.station.setErrors({ invalid: true });
            }
          });
      });
  }

  public getLocations(): void {
    this.tariffsService
      .getActiveLocations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: Locations[]) => {
        this.locations = res;
        this.regionsName = this.locations
          .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName))
          .flat(2);
        this.region.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this.filterOptions(value, this.regionsName))
          )
          .subscribe((data) => {
            this.filteredRegions = data;
            if (!data.length) {
              this.region.setErrors({ invalid: true });
            }
          });
      });
  }

  public getTariffCards(): void {
    this.tariffsService
      .getCardInfo()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: TariffCard[]) => {
        this.tariffCards = res;
      });
  }

  public selectCourier(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => ob.name === event.option.value));
    this.selectedCourier = {
      id: selectedValue.find((it) => it.courierId).courierId,
      name: selectedValue.map((it) => it.courierTranslationDtos.map((el) => el.name)).join()
    };
    this.onSelectedCourier();
    this.courier.valueChanges.subscribe((data) => {
      if (!data) {
        this.onDeletedField();
      }
    });
  }

  public onSelectedCourier(): void {
    const filteredTatiffCards = this.filterTariffCards();

    if (!filteredTatiffCards.length) {
      this.disableStation();
      this.disableRegion();
    }
    if (filteredTatiffCards.length) {
      this.selectAllStationsInTariffCards(filteredTatiffCards);
      this.selectAllRegionsInTariffCards(filteredTatiffCards);
      this.selectAllCitiesInTariffCards(filteredTatiffCards);
      this.region.enable();
      this.station.enable();
    }
  }

  public selectStation(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    this.addSelectedStation(event);
    this.station.setValue('');
    this.setStationPlaceholder();
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }

    if (this.selectedStations.length) {
      this.onStationsSelected();
    }
    if (!this.selectedStations.length) {
      this.courier.enable();
      this.region.enable();
      this.onDeletedField();
    }
  }

  public addSelectedStation(event: MatAutocompleteSelectedEvent): void {
    const selectedItem = this.stations.find((it) => it.name === event.option.value);
    const tempItem = {
      id: selectedItem.id,
      name: selectedItem.name
    };
    const itemIncluded = this.selectedStations.find((it) => it.id === tempItem.id);
    if (itemIncluded) {
      this.selectedStations = this.selectedStations.filter((item) => item.id !== tempItem.id);
    }
    if (!itemIncluded) {
      this.selectedStations.push(tempItem);
    }
  }

  public onStationsSelected(): void {
    const filteredTatiffCards = this.filterTariffCards();

    if (!filteredTatiffCards.length) {
      this.disableCourier();
      this.disableRegion();
    }
    if (filteredTatiffCards.length) {
      this.selectAllCouriersInTariffCards(filteredTatiffCards);
      this.selectAllRegionsInTariffCards(filteredTatiffCards);
      this.selectAllCitiesInTariffCards(filteredTatiffCards);
      this.region.enable();
      this.courier.enable();
    }
  }

  public setStationPlaceholder(): void {
    if (this.selectedStations.length) {
      this.stationPlaceholder = this.selectedStations.length + ' вибрано';
    } else {
      this.translate.get('ubs-tariffs.placeholder-choose-station').subscribe((data) => (this.stationPlaceholder = data));
    }
  }

  public deleteStation(index): void {
    this.selectedStations.splice(index, 1);
    this.setStationPlaceholder();
    if (this.selectedStations.length) {
      this.onStationsSelected();
    }
    if (!this.selectedStations.length) {
      this.courier.enable();
      this.region.enable();
      this.onDeletedField();
    }
  }

  public checkStation(item): boolean {
    return this.selectedStations.map((it) => it.name).includes(item);
  }

  public selectRegion(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    this.addSelectedRegion(event);
    this.setRegionsPlaceholder();
    this.region.setValue('');
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
    if (this.selectedRegions.length === 1) {
      this.onRegionSelected();
    }
    if (!this.selectedRegions.length) {
      this.disableCity();
      this.courier.enable();
      this.station.enable();
      this.onDeletedField();
    }
    if (this.selectedRegions.length > 1) {
      this.disableCourier();
      this.disableStation();
      this.disableCity();
    }
  }

  public addSelectedRegion(event: MatAutocompleteSelectedEvent): void {
    let id;
    let name;
    const selectedItemName = event.option.value;
    const selectedItem = this.locations.filter((element) => element.regionTranslationDtos.find((it) => it.regionName === selectedItemName));

    selectedItem.forEach((item) => {
      id = item.regionId;
      name = item.regionTranslationDtos
        .filter((it) => it.languageCode === 'ua')
        .map((it) => it.regionName)
        .toString();
    });
    const tempItem = { id, name };
    const itemIncluded = this.selectedRegions.find((it) => it.id === tempItem.id);
    if (itemIncluded) {
      this.selectedRegions = this.selectedRegions.filter((item) => item.id !== tempItem.id);
    }
    if (!itemIncluded) {
      this.selectedRegions.push(tempItem);
    }
  }

  public onRegionSelected(): void {
    const filteredTatiffCards = this.filterTariffCards();

    if (!filteredTatiffCards.length) {
      this.disableCourier();
      this.disableStation();
    }
    if (filteredTatiffCards.length) {
      this.selectAllCouriersInTariffCards(filteredTatiffCards);
      this.selectAllStationsInTariffCards(filteredTatiffCards);
      this.courier.enable();
      this.station.enable();
    }

    this.enableCity(filteredTatiffCards);
  }

  public enableCity(filteredTariffCards: Array<any>): void {
    const currentRegion = this.locations.filter((element) => element.regionId === this.selectedRegions[0].id);
    this.currentCities = currentRegion[0].locationsDto;

    if (!this.selectedCourier && !this.selectedStations.length) {
      this.currentCitiesName = this.currentCities
        .map((element) => element.locationTranslationDtoList.filter((it) => it.languageCode === 'ua').map((it) => it.locationName))
        .flat(2);
    }
    if (this.selectedCourier || this.selectedStations.length) {
      const allCitiesName = filteredTariffCards.map((it) => it.locationInfoDtos.map((el) => el.nameUk)).flat(2);
      this.currentCitiesName = this.filteredCities = this.removeDuplicates(allCitiesName);
    }
    this.city.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this.filterOptions(value, this.currentCitiesName))
      )
      .subscribe((data) => {
        this.filteredCities = data;
        if (!data.length) {
          this.city.setErrors({ invalid: true });
        }
      });
    this.city.enable();
  }

  public setRegionsPlaceholder(): void {
    this.selectedRegionsLength = this.selectedRegions.length;
    if (this.selectedRegionsLength) {
      this.regionPlaceholder = this.selectedRegionsLength + ' вибрано';
    } else {
      this.translate.get('ubs-tariffs.placeholder-choose-region').subscribe((data) => (this.regionPlaceholder = data));
    }
  }

  public checkRegion(item): boolean {
    return this.selectedRegions.map((it) => it.name).includes(item);
  }

  public deleteRegion(index): void {
    this.selectedRegions.splice(index, 1);
    this.setRegionsPlaceholder();
    if (this.selectedRegions.length === 1) {
      this.onRegionSelected();
    }
    if (!this.selectedRegions.length) {
      this.disableCity();
      this.courier.enable();
      this.station.enable();
      this.onDeletedField();
    }
    if (this.selectedRegions.length > 1) {
      this.disableCourier();
      this.disableStation();
      this.disableCity();
    }
  }

  public selectCity(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    this.addSelectedCity(event);
    this.city.setValue('');
    this.setCityPlaceholder();
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }

    if (this.selectedCities.length) {
      this.onCitiesSelected();
    }
    if (!this.selectedCities.length) {
      this.courier.enable();
      this.station.enable();
      this.onDeletedField();
    }
  }

  public addSelectedCity(event: MatAutocompleteSelectedEvent): void {
    const selectedItem = this.currentCities.filter((element) =>
      element.locationTranslationDtoList.find((it) => it.locationName === event.option.value)
    )[0];
    const tempItem = {
      id: selectedItem.locationId,
      name: selectedItem.locationTranslationDtoList
        .filter((it) => it.languageCode === 'ua')
        .map((it) => it.locationName)
        .join()
    };
    const itemIncluded = this.selectedCities.find((it) => it.id === tempItem.id);
    if (itemIncluded) {
      this.selectedCities = this.selectedCities.filter((item) => item.id !== tempItem.id);
    }
    if (!itemIncluded) {
      this.selectedCities.push(tempItem);
    }
  }

  public onCitiesSelected(): void {
    const filteredTatiffCards = this.filterTariffCards();

    if (!filteredTatiffCards.length) {
      this.disableCourier();
      this.disableStation();
    }
    if (filteredTatiffCards.length) {
      this.selectAllCouriersInTariffCards(filteredTatiffCards);
      this.selectAllStationsInTariffCards(filteredTatiffCards);
      this.selectAllRegionsInTariffCards(filteredTatiffCards);
      this.courier.enable();
      this.station.enable();
    }
  }

  public checkCity(item): boolean {
    return this.selectedCities.map((it) => it.name).includes(item);
  }

  public setCityPlaceholder(): void {
    this.selectedCityLength = this.selectedCities.length;
    if (this.selectedCityLength) {
      this.cityPlaceholder = this.selectedCityLength + ' вибрано';
    } else {
      this.translate.get('ubs-tariffs.placeholder-choose-city').subscribe((data) => (this.cityPlaceholder = data));
    }
  }

  public deleteCity(index): void {
    this.selectedCities.splice(index, 1);
    this.setCityPlaceholder();
    if (this.selectedCities.length) {
      this.onCitiesSelected();
    }
    if (this.selectedCities.length < 1) {
      this.courier.enable();
      this.station.enable();
      this.onDeletedField();
    }
  }

  public filterTariffCards(): TariffCard[] {
    let filteredTariffCards = this.tariffCards;
    if (this.selectedCourier) {
      filteredTariffCards = this.filterTariffCardsByCourier(filteredTariffCards);
    }
    if (this.selectedStations.length) {
      filteredTariffCards = this.filterTariffCardsByStations(filteredTariffCards);
    }
    if (this.selectedRegions.length) {
      filteredTariffCards = this.filterTariffCardsByRegion(filteredTariffCards);
    }
    if (this.selectedCities.length) {
      filteredTariffCards = this.filterTariffCardsByCities(filteredTariffCards);
    }
    return filteredTariffCards;
  }

  public filterTariffCardsByCourier(tariffCards: TariffCard[]): TariffCard[] {
    return tariffCards.filter((el) => el.courierId === this.selectedCourier.id);
  }

  public filterTariffCardsByStations(tariffCards: TariffCard[]): TariffCard[] {
    let filteredTariffCards = tariffCards;
    this.selectedStations.forEach((station) => {
      filteredTariffCards = filteredTariffCards.filter((el) => el.receivingStationDtos.find((it) => it.name === station.name));
    });
    return filteredTariffCards;
  }

  public filterTariffCardsByRegion(tariffCards: TariffCard[]): TariffCard[] {
    return tariffCards.filter((el) => el.regionDto.nameUk === this.selectedRegions[0].name);
  }

  public filterTariffCardsByCities(tariffCards: TariffCard[]): TariffCard[] {
    let filteredTariffCards = tariffCards;
    this.selectedCities.forEach((city) => {
      filteredTariffCards = filteredTariffCards.filter((el) => el.locationInfoDtos.find((it) => it.nameUk === city.name));
    });
    return filteredTariffCards;
  }

  public selectAllCouriersInTariffCards(filteredTatiffCards: TariffCard[]): void {
    const selectAllCouriers = filteredTatiffCards.map((it) => it.courierTranslationDtos.map((el) => el.name)).flat(2);
    this.couriersName = this.filteredCouriers = this.removeDuplicates(selectAllCouriers);
  }

  public selectAllStationsInTariffCards(filteredTatiffCards: TariffCard[]): void {
    const selectAllStations = filteredTatiffCards.map((it) => it.receivingStationDtos.map((el) => el.name)).flat(2);
    this.stationsName = this.filteredStations = this.removeDuplicates(selectAllStations);
  }

  public selectAllRegionsInTariffCards(filteredTatiffCards: TariffCard[]): void {
    const selectAllRegions = filteredTatiffCards.map((it) => it.regionDto.nameUk);
    this.regionsName = this.filteredRegions = this.removeDuplicates(selectAllRegions);
  }

  public selectAllCitiesInTariffCards(filteredTatiffCards: TariffCard[]): void {
    const selectAllCitiesName = filteredTatiffCards.map((it) => it.locationInfoDtos.map((el) => el.nameUk)).flat(2);
    this.currentCitiesName = this.filteredCities = this.removeDuplicates(selectAllCitiesName);
  }

  public disableCourier(): void {
    this.courier.setValue('');
    this.selectedCourier = null;
    this.courier.disable();
    this.filteredCouriers = this.couriersName = [];
  }

  public disableStation(): void {
    this.station.setValue('');
    this.selectedStations = [];
    this.setStationPlaceholder();
    this.station.disable();
    this.filteredStations = this.stationsName = [];
  }

  public disableRegion(): void {
    this.region.setValue('');
    this.selectedRegions = [];
    this.setRegionsPlaceholder();
    this.region.disable();
    this.filteredRegions = this.regionsName = [];
  }

  public disableCity(): void {
    this.city.setValue('');
    this.selectedCities = [];
    this.setCityPlaceholder();
    this.city.disable();
    this.filteredCities = this.currentCitiesName = [];
  }

  public onDeletedField(): void {
    if (!this.checkFields()) {
      this.setDefaultLists();
    }
    if (this.checkFields() === 1) {
      this.filterByOneField();
    }
    if (this.checkFields() >= 2) {
      this.filterByChosenFields();
    }
  }

  public checkFields(): number {
    let amountOfFilledFields = 0;
    if (this.selectedCourier) {
      amountOfFilledFields += 1;
    }
    if (this.selectedStations.length) {
      amountOfFilledFields += 1;
    }
    if (this.selectedRegions.length) {
      amountOfFilledFields += 1;
    }
    if (this.selectedCities.length) {
      amountOfFilledFields += 1;
    }
    return amountOfFilledFields;
  }

  public setDefaultLists(): void {
    this.filteredCouriers = this.couriersName = this.couriers.map((it) => it.courierTranslationDtos.map((el) => el.name)).flat(2);
    this.filteredStations = this.stationsName = this.stations.map((it) => it.name);
    this.filteredRegions = this.regionsName = this.locations
      .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName))
      .flat(2);
  }

  public filterByOneField(): void {
    const filteredTatiffCards = this.filterTariffCards();
    if (this.selectedCourier) {
      this.filteredCouriers = this.couriersName = this.couriers.map((it) => it.courierTranslationDtos.map((el) => el.name)).flat(2);
      this.selectAllStationsInTariffCards(filteredTatiffCards);
      this.selectAllRegionsInTariffCards(filteredTatiffCards);
      this.selectAllCitiesInTariffCards(filteredTatiffCards);
    }
    if (this.selectedStations.length) {
      this.filteredStations = this.stationsName = this.stations.map((it) => it.name);
      this.selectAllCouriersInTariffCards(filteredTatiffCards);
      this.selectAllRegionsInTariffCards(filteredTatiffCards);
      this.selectAllCitiesInTariffCards(filteredTatiffCards);
    }
    if (this.selectedRegions.length) {
      this.filteredRegions = this.regionsName = this.locations
        .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName))
        .flat(2);
      this.selectAllCouriersInTariffCards(filteredTatiffCards);
      this.selectAllStationsInTariffCards(filteredTatiffCards);
    }
  }

  public filterByChosenFields(): void {
    const filteredTatiffCards = this.filterTariffCards();
    this.selectAllCouriersInTariffCards(filteredTatiffCards);
    this.selectAllStationsInTariffCards(filteredTatiffCards);
    this.selectAllRegionsInTariffCards(filteredTatiffCards);
    this.selectAllCitiesInTariffCards(filteredTatiffCards);
  }

  public openAuto(event: Event, trigger: MatAutocompleteTrigger, flag: boolean): void {
    if (!flag) {
      event.stopPropagation();
      trigger.openPanel();
    }
  }

  public filterOptions(name: string, items: any[]): any[] {
    const filterValue = name.toLowerCase();
    return items.filter((option) => option.toLowerCase().includes(filterValue));
  }

  public removeDuplicates(arr: Array<string>): Array<string> {
    const filteredArr = [];
    arr.forEach((it) => {
      if (!filteredArr.includes(it)) {
        filteredArr.push(it);
      }
    });
    return filteredArr;
  }

  public createDeactivateCardDto() {
    this.deactivateCardObj = {
      courierId: this.selectedCourier.id,
      receivingStationsIdList: this.selectedStations.map((it) => it.id),
      regionId: this.selectedRegions.map((it) => it.id),
      locationIdList: this.selectedCities.map((it) => it.id)
    };
  }

  public deactivateCard(): void {
    this.dialogRef.close();
    const matDialogRef = this.dialog.open(TariffDeactivateConfirmationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        courierName: this.selectedCourier?.name,
        stationNames: this.selectedStations.map((it) => it.name),
        regionName: this.selectedRegions.map((it) => it.name),
        locationNames: this.selectedCities.map((it) => it.name)
      }
    });
    matDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // here will be deativate request
      }
    });
  }

  public onNoClick(): void {
    if (this.checkFields()) {
      const matDialogRef = this.dialog.open(ModalTextComponent, {
        hasBackdrop: true,
        panelClass: 'address-matDialog-styles-w-100',
        data: {
          name: 'cancel',
          title: 'modal-text.cancel',
          text: 'modal-text.cancel-message',
          action: 'modal-text.yes'
        }
      });
      matDialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }
}
