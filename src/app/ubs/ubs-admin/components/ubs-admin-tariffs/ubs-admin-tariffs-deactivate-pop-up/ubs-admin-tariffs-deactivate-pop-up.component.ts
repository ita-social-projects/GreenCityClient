import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TariffsService } from '../../../services/tariffs.service';
import { Locations, LocationDto, SelectedItems, Couriers, Stations, TariffCard, TranslationDto } from '../../../models/tariffs.interface';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { TariffPlaceholderSelected, TariffLocationLabelName, TariffCourierLabelName, TariffRegionLabelName } from '../ubs-tariffs.enum';
import { Language } from 'src/app/main/i18n/Language';
import { statusOfTariff } from '../tariff-status.enum';

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
  public datePipe = new DatePipe(this.languageService.getCurrentLanguage());
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
  public currentLanguage: string;
  public selectedValue: Couriers;
  public isDeactivatePopUp: boolean;
  public isActivatePopUp: boolean;
  public placeholderSelectedEn = TariffPlaceholderSelected.en;
  public placeholderSelectedUa = TariffPlaceholderSelected.ua;
  public courierLabelEn = TariffCourierLabelName.en;
  public courierLabelUa = TariffCourierLabelName.ua;
  public regionLabelEn = TariffRegionLabelName.en;
  public regionLabelUa = TariffRegionLabelName.ua;
  public cityLabelEn = TariffLocationLabelName.en;
  public cityLabelUa = TariffLocationLabelName.ua;

  constructor(
    private fb: UntypedFormBuilder,
    private localeStorage: LocalStorageService,
    private tariffsService: TariffsService,
    private languageService: LanguageService,
    private translate: TranslateService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      isActivation: boolean;
      isDeactivation: boolean;
    },
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
    this.isDeactivatePopUp = this.modalData.isDeactivation;
    this.isActivatePopUp = this.modalData.isActivation;
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.setStationPlaceholder();
    this.setRegionsPlaceholder();
    this.setCityPlaceholder();
    setTimeout(() => this.city.disable());
    this.getCouriers();
    this.getReceivingStation();
    this.isActivatePopUp ? this.getLocations(false) : this.getLocations(true);
    this.getTariffCards();
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  public getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: Couriers[]) => {
        this.couriers = res.filter(
          (it) =>
            (this.isActivatePopUp && it.courierStatus === statusOfTariff.deactivated) ||
            (this.isDeactivatePopUp && it.courierStatus === statusOfTariff.active)
        );
        this.couriersName = this.couriers.map((el) => this.getLangValue(el.nameUk, el.nameEn));
        this.courier.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this.filterOptions(value, this.couriersName))
          )
          .subscribe((data) => {
            this.filteredCouriers = data;
            if (!this.courier.value && this.selectedCourier) {
              this.selectedCourier = null;
              this.onDeletedField();
              this.enableAbstractControl([this.station, this.region]);
            }
            if (!data.length && this.courier.value) {
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
        this.stations = res.filter(
          (it) =>
            (this.isActivatePopUp && it.stationStatus === statusOfTariff.deactivated) ||
            (this.isDeactivatePopUp && it.stationStatus === statusOfTariff.active)
        );
        this.stationsName = this.stations.map((it) => it.name);
        this.station.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this.filterOptions(value, this.stationsName))
          )
          .subscribe((data) => {
            this.filteredStations = data;
            if (!data.length && this.station.value) {
              this.station.setErrors({ invalid: true });
            }
          });
      });
  }

  getLocations(isActive: boolean): void {
    this.fetchLocations(isActive)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: Locations[]) => {
        this.locations = res;
        this.regionsName = this.locations
          .map((element) => this.nameCreationUtil(element.regionTranslationDtos, this.currentLanguage, 'regionName'))
          .flat(2);
        this.region.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this.filterOptions(value, this.regionsName))
          )
          .subscribe((data) => {
            this.filteredRegions = data;
            if (!data.length && this.region.value) {
              this.region.setErrors({ invalid: true });
            }
          });
      });
  }

  private fetchLocations(isActive: boolean): Observable<Locations[]> {
    return isActive ? this.tariffsService.getActiveLocations() : this.tariffsService.getDeactivatedLocations();
  }

  public getTariffCards(): void {
    this.tariffsService
      .getCardInfo()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: TariffCard[]) => {
        this.tariffCards = res.filter(
          (it) =>
            (this.isActivatePopUp && it.tariffStatus === statusOfTariff.deactivated) ||
            (this.isDeactivatePopUp && it.tariffStatus === statusOfTariff.active)
        );
      });
  }

  public selectCourier(event: MatAutocompleteSelectedEvent): void {
    this.selectedValue = this.couriers.find((ob) => this.getLangValue(ob.nameUk, ob.nameEn) === event.option.value);
    this.selectedCourier = {
      id: this.selectedValue.courierId,
      name: this.getLangValue(this.selectedValue.nameUk, this.selectedValue.nameEn)
    };
    this.onSelectedCourier();
  }

  public onSelectedCourier(): void {
    const filteredTariffCards = this.filterTariffCards();

    if (!filteredTariffCards.length) {
      this.disableStation();
      this.disableRegion();
    }
    if (filteredTariffCards.length) {
      this.selectAllStationsInTariffCards(filteredTariffCards);
      this.selectAllRegionsInTariffCards(filteredTariffCards);
      this.selectAllCitiesInTariffCards(filteredTariffCards);
      this.enableAbstractControl([this.station, this.region]);
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
      this.onDeletedField();
      this.enableAbstractControl([this.courier, this.region]);
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
    const filteredTariffCards = this.filterTariffCards();

    if (!filteredTariffCards.length) {
      this.disableCourier();
      this.disableRegion();
    }
    if (filteredTariffCards.length) {
      this.selectAllCouriersInTariffCards(filteredTariffCards);
      this.selectAllRegionsInTariffCards(filteredTariffCards);
      this.selectAllCitiesInTariffCards(filteredTariffCards);
      this.enableAbstractControl([this.courier, this.region]);
    }
  }

  public setStationPlaceholder(): void {
    if (this.selectedStations.length) {
      this.stationPlaceholder = this.tariffsService.getPlaceholderValue(this.selectedStations.length);
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
      this.onDeletedField();
      this.enableAbstractControl([this.courier, this.region]);
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
      this.onDeletedField();
      this.enableAbstractControl([this.courier, this.station]);
    }
    if (this.selectedRegions.length > 1) {
      this.disableCourier();
      this.disableStation();
      this.disableCity();
    }
  }

  public nameCreationUtil(translationDtos: TranslationDto[], language: string, name: string) {
    return translationDtos.filter((it) => it.languageCode === language).map((it) => it[name]);
  }

  public addSelectedRegion(event: MatAutocompleteSelectedEvent): void {
    let id;
    let name;
    let nameUa;
    const selectedItemName = event.option.value;
    const selectedItem = this.locations.filter((element) => element.regionTranslationDtos.find((it) => it.regionName === selectedItemName));

    selectedItem.forEach((item) => {
      id = item.regionId;
      name = this.nameCreationUtil(item.regionTranslationDtos, Language.EN, 'regionName').toString();
      nameUa = this.nameCreationUtil(item.regionTranslationDtos, Language.UA, 'regionName').toString();
    });
    const tempItem = { id, name, nameUa };
    const itemIncluded = this.selectedRegions.find((it) => it.id === tempItem.id);
    if (itemIncluded) {
      this.selectedRegions = this.selectedRegions.filter((item) => item.id !== tempItem.id);
    }
    if (!itemIncluded) {
      this.selectedRegions.push(tempItem);
    }
  }

  public onRegionSelected(): void {
    const filteredTariffCards = this.filterTariffCards();

    if (!filteredTariffCards.length) {
      this.disableCourier();
      this.disableStation();
    }
    if (filteredTariffCards.length) {
      this.selectAllCouriersInTariffCards(filteredTariffCards);
      this.selectAllStationsInTariffCards(filteredTariffCards);
      this.enableAbstractControl([this.courier, this.station]);
    }

    this.enableCity(filteredTariffCards);
  }

  public enableCity(filteredTariffCards: Array<any>): void {
    const currentRegion = this.locations.filter((element) => element.regionId === this.selectedRegions[0].id);
    this.currentCities = currentRegion[0].locationsDto;

    if (!this.selectedCourier && !this.selectedStations.length) {
      this.currentCitiesName = this.currentCities
        .map((element) =>
          element.locationTranslationDtoList.filter((it) => it.languageCode === this.currentLanguage).map((it) => it.locationName)
        )
        .flat(2);
    }
    if (this.selectedCourier || this.selectedStations.length) {
      const allCitiesName = filteredTariffCards
        .map((it) => it.locationInfoDtos.map((el) => this.getLangValue(el.nameUk, el.nameEn)))
        .flat(2);
      this.currentCitiesName = this.filteredCities = this.removeDuplicates(allCitiesName);
    }
    this.city.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this.filterOptions(value, this.currentCitiesName))
      )
      .subscribe((data) => {
        this.filteredCities = data;
        if (!data.length && this.city.value) {
          this.city.setErrors({ invalid: true });
        }
      });
    this.city.enable();
  }

  public setRegionsPlaceholder(): void {
    this.selectedRegionsLength = this.selectedRegions.length;
    if (this.selectedRegionsLength) {
      this.regionPlaceholder = this.tariffsService.getPlaceholderValue(this.selectedRegionsLength);
    } else {
      this.translate.get('ubs-tariffs.placeholder-choose-region').subscribe((data) => (this.regionPlaceholder = data));
    }
  }

  public checkOption(item, itemType): boolean {
    const itemsNames = itemType.map((it) => (this.currentLanguage === Language.EN ? it.name : it.nameUa));
    return itemsNames.includes(item);
  }

  public deleteRegion(index): void {
    this.selectedRegions.splice(index, 1);
    this.setRegionsPlaceholder();
    if (this.selectedRegions.length === 1) {
      this.onRegionSelected();
    }
    if (!this.selectedRegions.length) {
      this.disableCity();
      this.onDeletedField();
      this.enableAbstractControl([this.courier, this.station]);
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
      this.onDeletedField();
      this.enableAbstractControl([this.courier, this.station]);
    }
  }

  public addSelectedCity(event: MatAutocompleteSelectedEvent): void {
    const selectedItem = this.currentCities.filter((element) =>
      element.locationTranslationDtoList.find((it) => it.locationName === event.option.value)
    )[0];
    const tempItem = {
      id: selectedItem.locationId,
      name: this.nameCreationUtil(selectedItem.locationTranslationDtoList, Language.EN, 'locationName').join(),
      nameUa: this.nameCreationUtil(selectedItem.locationTranslationDtoList, Language.UA, 'locationName').join()
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
    const filteredTariffCards = this.filterTariffCards();

    if (!filteredTariffCards.length) {
      this.disableCourier();
      this.disableStation();
    }
    if (filteredTariffCards.length) {
      this.selectAllCouriersInTariffCards(filteredTariffCards);
      this.selectAllStationsInTariffCards(filteredTariffCards);
      this.selectAllRegionsInTariffCards(filteredTariffCards);
      this.enableAbstractControl([this.courier, this.station]);
    }
  }

  public setCityPlaceholder(): void {
    this.selectedCityLength = this.selectedCities.length;
    if (this.selectedCityLength) {
      this.cityPlaceholder = this.tariffsService.getPlaceholderValue(this.selectedCityLength);
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
    if (!this.selectedCities.length) {
      this.onDeletedField();
      this.enableAbstractControl([this.courier, this.station]);
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
    return tariffCards.filter((el) => el.courierDto.courierId === this.selectedCourier.id);
  }

  public filterTariffCardsByStations(tariffCards: TariffCard[]): TariffCard[] {
    let filteredTariffCards = tariffCards;
    this.selectedStations.forEach((station) => {
      filteredTariffCards = filteredTariffCards.filter((el) => el.receivingStationDtos.find((it) => it.name === station.name));
    });
    return filteredTariffCards;
  }

  public filterTariffCardsByRegion(tariffCards: TariffCard[]): TariffCard[] {
    return tariffCards.filter((el) => this.getLangValue(el.regionDto.nameUk, el.regionDto.nameEn) === this.selectedRegions[0].name);
  }

  public filterTariffCardsByCities(tariffCards: TariffCard[]): TariffCard[] {
    let filteredTariffCards = tariffCards;
    this.selectedCities.forEach((city) => {
      filteredTariffCards = filteredTariffCards.filter((el) =>
        el.locationInfoDtos.find((it) => this.getLangValue(it.nameUk, it.nameEn) === city.name)
      );
    });
    return filteredTariffCards;
  }

  public selectAllCouriersInTariffCards(filteredTariffCards: TariffCard[]): void {
    const selectAllCouriers = filteredTariffCards.map((val) => this.getLangValue(val.courierDto.nameUk, val.courierDto.nameEn));
    this.couriersName = this.filteredCouriers = this.removeDuplicates(selectAllCouriers);
  }

  public selectAllStationsInTariffCards(filteredTariffCards: TariffCard[]): void {
    const selectAllStations = filteredTariffCards.map((it) => it.receivingStationDtos.map((el) => el.name)).flat(2);
    this.stationsName = this.filteredStations = this.removeDuplicates(selectAllStations);
  }

  public selectAllRegionsInTariffCards(filteredTariffCards: TariffCard[]): void {
    const selectAllRegions = filteredTariffCards.map((it) => this.getLangValue(it.regionDto.nameUk, it.regionDto.nameEn));
    this.regionsName = this.filteredRegions = this.removeDuplicates(selectAllRegions);
  }

  public selectAllCitiesInTariffCards(filteredTariffCards: TariffCard[]): void {
    const selectAllCitiesName = filteredTariffCards
      .map((it) => it.locationInfoDtos.map((el) => this.getLangValue(el.nameUk, el.nameEn)))
      .flat(2);
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
    this.filteredCouriers = this.couriersName = this.couriers.map((el) => this.getLangValue(el.nameUk, el.nameEn));
    this.filteredStations = this.stationsName = this.stations.map((it) => it.name);
    this.filteredRegions = this.regionsName = this.locations
      .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === this.currentLanguage).map((it) => it.regionName))
      .flat(2);
  }

  public filterByOneField(): void {
    const filteredTariffCards = this.filterTariffCards();
    if (this.selectedCourier) {
      this.filteredCouriers = this.couriersName = this.couriers.map((el) => this.getLangValue(el.nameUk, el.nameEn));
      this.selectAllStationsInTariffCards(filteredTariffCards);
      this.selectAllRegionsInTariffCards(filteredTariffCards);
      this.selectAllCitiesInTariffCards(filteredTariffCards);
    }
    if (this.selectedStations.length) {
      this.filteredStations = this.stationsName = this.stations.map((it) => it.name);
      this.selectAllCouriersInTariffCards(filteredTariffCards);
      this.selectAllRegionsInTariffCards(filteredTariffCards);
      this.selectAllCitiesInTariffCards(filteredTariffCards);
    }
    if (this.selectedRegions.length) {
      this.filteredRegions = this.regionsName = this.locations
        .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === this.currentLanguage).map((it) => it.regionName))
        .flat(2);
      this.selectAllCouriersInTariffCards(filteredTariffCards);
      this.selectAllStationsInTariffCards(filteredTariffCards);
    }
  }

  public filterByChosenFields(): void {
    const filteredTariffCards = this.filterTariffCards();
    this.selectAllCouriersInTariffCards(filteredTariffCards);
    this.selectAllStationsInTariffCards(filteredTariffCards);
    this.selectAllRegionsInTariffCards(filteredTariffCards);
    this.selectAllCitiesInTariffCards(filteredTariffCards);
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

  public enableAbstractControl(arr: Array<AbstractControl>): void {
    arr.forEach((it) => it.enable());
  }

  public deactivateCard(): void {
    this.dialogRef.close({
      selectedValue: this.selectedValue,
      selectedRegionValue: this.selectedRegions,
      selectedCitiesValue: this.selectedCities,
      selectedStations: this.selectedStations,
      selectedCourier: this.selectedCourier,
      isActivation: this.isActivatePopUp,
      isDeactivation: this.isDeactivatePopUp
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

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }
}
