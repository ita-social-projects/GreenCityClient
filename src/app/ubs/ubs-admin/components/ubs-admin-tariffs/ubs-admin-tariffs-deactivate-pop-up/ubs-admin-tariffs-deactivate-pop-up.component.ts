import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TariffsService } from '../../../services/tariffs.service';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { Locations, CreateCard } from '../../../models/tariffs.interface';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { TranslateService } from '@ngx-translate/core';
import { TariffConfirmationPopUpComponent } from '../../shared/components/tariff-confirmation-pop-up/tariff-confirmation-pop-up.component';

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
    city: [{ value: '', disabled: true }, [Validators.maxLength(40)]]
  });
  public icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg',
    cross: '././assets/img/ubs/cross.svg'
  };
  public name: string;
  public datePipe = new DatePipe('ua');
  public newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  unsubscribe: Subject<any> = new Subject();

  public couriers;
  public couriersName;
  public filteredCouriers;

  public locations;
  public filteredRegions;
  public regionsName;
  public selectedRegions = [];
  public selectedRegionsLength: number;
  public regionPlaceholder: string;
  public stations;
  public stationsName;
  public filteredStations;
  public selectedStations = [];
  public stationPlaceholder: string;
  public currentCities = [];
  public filteredCities = [];
  public selectedCities = [];
  public currentCitiesName = [];
  public cityPlaceholder: string;
  public selectedCityLength: number;
  public reset = true;
  public courierId: number;
  public regionId: number;
  public createCardObj: CreateCard;
  public blurOnOption = false;
  public isCardExist;
  public currentLanguage: string;
  public tariffCards = [];
  public filteredTatiffCards = [];

  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);

  constructor(
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    private tariffsService: TariffsService,
    private store: Store<IAppState>,
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
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
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

  // public onBlur(event): void {
  //   if (event.relatedTarget.localName === 'mat-option') {
  //     this.blurOnOption = true;
  //   }
  // }

  public getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
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
            }
          });
      });
  }

  public getReceivingStation(): void {
    this.tariffsService
      .getAllStations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.stations = res;
        this.stationsName = this.stations.map((it) => it.name);
        this.station.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this.filterOptions(value, this.stationsName))
          )
          .subscribe((data) => {
            this.filteredStations = data;
          });
      });
  }

  public getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));

    this.locations$.pipe(skip(1)).subscribe((item) => {
      this.locations = item;
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
        });
    });
  }

  public getTariffCards(): void {
    this.tariffsService
      .getCardInfo()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.tariffCards = res;
      });
  }

  public selectCourier(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => ob.name === event.option.value));
    this.courierId = selectedValue.find((it) => it.courierId).courierId;
    this.onSelectedCourier();
    this.courier.valueChanges.subscribe((data) => {
      if (!data) {
        this.onDeletedField();
      }
    });
  }

  public onSelectedCourier(): void {
    const filteredTatiffCards = this.filterTariffCards();
    console.log(filteredTatiffCards);

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

  public selectStation(event: MatAutocompleteSelectedEvent, trigger: MatAutocompleteTrigger): void {
    this.addSelectedStation(event);
    this.station.setValue('');
    this.setStationPlaceholder();
    requestAnimationFrame(() => {
      trigger.openPanel();
    });

    if (this.selectedStations.length) {
      this.onStationsSelected();
    }
    if (!this.selectedStations.length) {
      this.courier.enable();
      this.station.enable();
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
    console.log(filteredTatiffCards);

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
      this.station.enable();
      this.onDeletedField();
    }
  }

  public checkStation(item): boolean {
    return this.selectedStations.map((it) => it.name).includes(item);
  }

  public selectRegion(event: MatAutocompleteSelectedEvent, trigger: MatAutocompleteTrigger): void {
    this.addSelectedRegion(event);
    this.setRegionsPlaceholder();
    this.region.setValue('');
    requestAnimationFrame(() => {
      trigger.openPanel();
    });
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
    console.log(filteredTatiffCards);

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

    if (!this.courier.value && !this.selectedStations.length) {
      this.currentCitiesName = this.currentCities
        .map((element) => element.locationTranslationDtoList.filter((it) => it.languageCode === 'ua').map((it) => it.locationName))
        .flat(2);
    }
    if (this.courier.value || this.selectedStations.length) {
      const allCitiesName = filteredTariffCards.map((it) => it.locationInfoDtos.map((el) => el.nameUk)).flat(2);
      this.currentCitiesName = this.filteredCities = this.removeDuplicates(allCitiesName);
      console.log(this.filteredCities);
    }
    this.city.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this.filterOptions(value, this.currentCitiesName))
      )
      .subscribe((data) => {
        this.filteredCities = data;
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

  public selectCity(event: MatAutocompleteSelectedEvent, trigger: MatAutocompleteTrigger): void {
    this.addSelectedCity(event);
    this.city.setValue('');
    this.setCityPlaceholder();
    requestAnimationFrame(() => {
      trigger.openPanel();
    });

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
    console.log(filteredTatiffCards);

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
      this.onRegionSelected();
      this.courier.enable();
      this.station.enable();
    }
  }

  public filterTariffCards(): Array<any> {
    let filteredTariffCards = this.tariffCards;
    if (this.courier.value) {
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

  public filterTariffCardsByCourier(tariffCards: Array<any>): Array<any> {
    return tariffCards.filter((el) => el.courierId === this.courierId);
  }

  public filterTariffCardsByStations(tariffCards: Array<any>): Array<any> {
    let filteredTariffCards = tariffCards.filter((el) => el.receivingStationDtos.find((it) => it.name === this.selectedStations[0].name));
    this.selectedStations.forEach((station) => {
      filteredTariffCards = filteredTariffCards.filter((el) => el.receivingStationDtos.find((it) => it.name === station.name));
    });
    return filteredTariffCards;
  }

  public filterTariffCardsByRegion(tariffCards: Array<any>): Array<any> {
    return tariffCards.filter((el) => el.regionDto.nameUk === this.selectedRegions[0].name);
  }

  public filterTariffCardsByCities(tariffCards: Array<any>): Array<any> {
    let filteredTariffCards = tariffCards.filter((el) => el.locationInfoDtos.find((it) => it.nameUk === this.selectedCities[0].name));
    this.selectedCities.forEach((city) => {
      filteredTariffCards = filteredTariffCards.filter((el) => el.locationInfoDtos.find((it) => it.nameUk === city.name));
    });
    return filteredTariffCards;
  }

  public selectAllCouriersInTariffCards(filteredTatiffCards: Array<any>): void {
    const selectAllCouriers = filteredTatiffCards.map((it) => it.courierTranslationDtos.map((el) => el.name)).flat(2);
    this.couriersName = this.filteredCouriers = this.removeDuplicates(selectAllCouriers);
    console.log(this.filteredCouriers);
  }

  public selectAllStationsInTariffCards(filteredTatiffCards: Array<any>): void {
    const selectAllStations = filteredTatiffCards.map((it) => it.receivingStationDtos.map((el) => el.name)).flat(2);
    this.stationsName = this.filteredStations = this.removeDuplicates(selectAllStations);
    console.log(this.filteredStations);
  }

  public selectAllRegionsInTariffCards(filteredTatiffCards: Array<any>): void {
    const selectAllRegions = filteredTatiffCards.map((it) => it.regionDto.nameUk);
    this.regionsName = this.filteredRegions = this.removeDuplicates(selectAllRegions);
    console.log(this.filteredRegions);
  }

  public selectAllCitiesInTariffCards(filteredTatiffCards: Array<any>): void {
    const selectAllCitiesName = filteredTatiffCards.map((it) => it.locationInfoDtos.map((el) => el.nameUk)).flat(2);
    this.currentCitiesName = this.filteredCities = this.removeDuplicates(selectAllCitiesName);
    console.log(this.filteredCities);
  }

  public disableCourier(): void {
    this.courier.setValue('');
    this.courierId = null;
    this.courier.disable();
  }

  public disableStation(): void {
    this.station.setValue('');
    this.selectedStations = [];
    this.setStationPlaceholder();
    this.station.disable();
  }

  public disableRegion(): void {
    this.region.setValue('');
    this.selectedRegions = [];
    this.setRegionsPlaceholder();
    this.region.disable();
  }

  public disableCity(): void {
    this.city.setValue('');
    this.selectedCities = [];
    this.setCityPlaceholder();
    this.city.disable();
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
    if (this.courier.value) {
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
    if (this.courier.value) {
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
    console.log(filteredTatiffCards);
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
    this.createCardObj = {
      courierId: this.courierId,
      receivingStationsIdList: this.selectedStations.map((it) => it.id).sort(),
      regionId: this.regionId,
      locationIdList: this.selectedCities.map((it) => it.locationId).sort()
    };
  }

  public deactivateCard(): void {
    this.dialogRef.close();
    const matDialogRef = this.dialog.open(TariffConfirmationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        title: 'ubs-tariffs-add-location-pop-up.create_card_title',
        courierName: this.courier.value,
        stationNames: this.selectedStations.map((it) => it.name),
        regionName: this.selectedRegions.map((it) => it.name),
        locationNames: this.selectedCities.map((it) => it.location),
        action: 'ubs-tariffs-add-location-pop-up.create_button'
      }
    });
    matDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.tariffsService;
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
