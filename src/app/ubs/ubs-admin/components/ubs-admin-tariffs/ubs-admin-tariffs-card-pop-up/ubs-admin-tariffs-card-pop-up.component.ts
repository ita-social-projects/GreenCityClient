import { Language } from 'src/app/main/i18n/Language';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TariffsService } from '../../../services/tariffs.service';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { Locations, CreateCard, Couriers, Stations } from '../../../models/tariffs.interface';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { TranslateService } from '@ngx-translate/core';
import { TariffConfirmationPopUpComponent } from '../../shared/components/tariff-confirmation-pop-up/tariff-confirmation-pop-up.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { TariffConfirmationPopUpInterface } from 'src/app/ubs/ubs-admin/models/ubs-pop-up.interface';

@Component({
  selector: 'app-ubs-admin-tariffs-card-pop-up',
  templateUrl: './ubs-admin-tariffs-card-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-card-pop-up.component.scss']
})
export class UbsAdminTariffsCardPopUpComponent implements OnInit, OnDestroy {
  CardForm = this.fb.group({
    courierName: ['', Validators.required],
    station: ['', Validators.required],
    regionName: ['', Validators.required],
    city: [{ value: '', disabled: true }, [Validators.maxLength(40), Validators.required]]
  });
  public icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg',
    cross: '././assets/img/ubs/cross.svg'
  };
  public name: string;
  public currentLanguage: string;
  public datePipe;
  public newDate;
  unsubscribe: Subject<any> = new Subject();

  public couriers: Couriers[];
  public couriersName;
  public courierEnglishName;
  public courierUkrainianName;
  public locations: Locations[];
  public regions;
  public regionEnglishName;
  public regionUkrainianName;
  public stations: Stations[];
  public filteredStations;
  public selectedStation = [];
  public stationPlaceholder: string;
  public filteredCities;
  public selectedCities = [];
  public cityPlaceholder: string;
  public selectedCityLength: number;
  public citySelected = false;
  public reset = true;
  public courierId: number;
  public regionId: number;
  public createCardObj: CreateCard;
  public blurOnOption = false;
  public isCardExist;

  courierNameUk;
  courierNameEn;
  currentCourierNameTranslated;
  cityEn;
  cityUk;
  currentStation: string;
  currentRegionTranslated;
  regionEng: string;
  isEdit: boolean;
  isCreate: boolean;
  provideValues: boolean;
  tariffId: number;
  isLocationAlreadyUsed: boolean;
  cityPlaceholderTranslated: string;

  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private localeStorageService: LocalStorageService,
    private tariffsService: TariffsService,
    private store: Store<IAppState>,
    private translate: TranslateService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsCardPopUpComponent>,
    public languageService: LanguageService,
    private snackBar: MatSnackBarComponent
  ) {}

  get courier() {
    return this.CardForm.get('courierName');
  }
  get station() {
    return this.CardForm.get('station');
  }
  get region() {
    return this.CardForm.get('regionName');
  }
  get city() {
    return this.CardForm.get('city');
  }

  ngOnInit(): void {
    this.isEdit = this.modalData.edit;
    this.isCreate = this.modalData.create;
    this.tariffId = this.modalData.tariffId;
    this.courierNameUk = this.modalData.courierUkrainianName;
    this.courierNameEn = this.modalData.courierEnglishName;
    this.provideValues = this.modalData.provideValues;
    this.currentStation = this.modalData.selectedStation || '';
    this.regionEnglishName = this.modalData.regionEnglishName || '';
    this.regionUkrainianName = this.modalData.regionUkrainianName || '';
    this.regionId = this.modalData.regionId || null;
    this.cityUk = this.modalData.cityNameUk || '';
    this.cityEn = this.modalData.cityNameEn || '';
    this.courierId = this.modalData.courierId || null;
    this.courierEnglishName = this.modalData.courierEnglishName || '';
    this.courierUkrainianName = this.modalData.courierUkrainianName || '';

    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
    this.localeStorageService.languageBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.datePipe = new DatePipe(this.currentLanguage);
      this.newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
    });

    this.setStationPlaceholder();
    this.setCountOfSelectedCity();
    this.getCouriers();
    this.getReceivingStation();
    this.getLocations();
    this.setCountOfSelectedCity();

    if (this.isEdit || this.provideValues) {
      this.fillFields(this.modalData);
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public onBlur(event): void {
    if (event.relatedTarget.localName === 'mat-option') {
      this.blurOnOption = true;
    }
  }

  public cityValidator(): ValidatorFn {
    let error;
    if (!this.selectedCities.length) {
      error = this.city.setErrors({ emptySelectedCity: true });
    }
    return error;
  }

  public stationValidator(): ValidatorFn {
    let error;
    if (!this.selectedStation.length) {
      error = this.station.setErrors({ emptySelectedStation: true });
    }
    return error;
  }

  public getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: Couriers[]) => {
        this.couriers = res;
        this.couriersName = this.couriers.map((item) => this.getLangValue(item.nameUk, item.nameEn));
      });
  }

  checkIfLocationUsed(): boolean {
    this.isLocationAlreadyUsed = false;
    this.tariffsService.getCardInfo().subscribe((res) => {
      const selectedIds = this.selectedCities.map((val) => val.locationId);
      res.forEach((card) => {
        if (card.locationInfoDtos.every((val) => selectedIds.includes(val.locationId))) {
          this.isLocationAlreadyUsed = true;
        }
      });
    });
    return this.isLocationAlreadyUsed;
  }

  public getReceivingStation(): void {
    this.tariffsService
      .getAllStations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: Stations[]) => {
        this.stations = res;

        if (this.isEdit || this.provideValues) {
          this.setSelectedStation();
        }

        const stationsName = this.stations.map((it) => it.name);
        this.station.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this._filterOptions(value, stationsName))
          )
          .subscribe((data) => {
            this.filteredStations = data;
            this.station.setValidators(this.stationValidator());
          });
      });
  }

  public getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));

    this.locations$.pipe(skip(1)).subscribe((item: Locations[]) => {
      if (item) {
        this.locations = item;
        this.regions = this.locations
          .map((element) =>
            element.regionTranslationDtos.filter((it) => it.languageCode === this.currentLanguage).map((it) => it.regionName)
          )
          .flat(2);

        if (this.isEdit || (this.provideValues && this.regionEnglishName)) {
          this.setSelectedCities();
        }
      }
    });
  }

  setSelectedStation() {
    this.selectedStation = this.station.value.map((stationName) => {
      const selectedStationValue = this.stations.find((ob) => ob.name === stationName);

      return {
        name: selectedStationValue.name,
        id: selectedStationValue.id
      };
    });
    this.station.setValidators(this.stationValidator());
    this.station.setValue('');
    this.blurOnOption = false;

    this.setStationPlaceholder();
  }

  private setSelectedCities(): void {
    const currentRegion = this.locations.filter((element) =>
      element.regionTranslationDtos.find((it) => it.regionName === this.region.value)
    );
    this.filteredCities = currentRegion[0].locationsDto;

    this.selectedCities = this.cityUk.map((cityUk, index) => {
      const cityEn = this.cityEn[index];
      const cityObj = this.filteredCities.find((city) =>
        city.locationTranslationDtoList.some((loc) => loc.locationName === cityUk || loc.locationName === cityEn)
      );

      return {
        location: cityUk,
        englishLocation: cityEn,
        locationId: cityObj ? cityObj.locationId : null
      };
    });
    this.setCountOfSelectedCity();
    this.city.reset();
    this.city.setValidators(this.cityValidator());
    this.city.enable();
  }

  public onSelectCourier(event): void {
    const selectedValue = this.couriers.find((ob) => {
      const name = this.getLangValue(ob.nameUk, ob.nameEn);
      return name === event.value;
    });
    this.courierEnglishName = selectedValue.nameEn;
    this.courierUkrainianName = selectedValue.nameUk;
    this.currentCourierNameTranslated = this.getLangValue(selectedValue.nameEn, selectedValue.nameUk);
    this.courierId = selectedValue.courierId;
    this.isCardExist = false;
  }

  public setStationPlaceholder(): void {
    if (this.selectedStation.length) {
      this.stationPlaceholder = this.tariffsService.getPlaceholderValue(this.selectedStation.length);
    } else {
      this.translate.get('ubs-tariffs.placeholder-choose-station').subscribe((data) => (this.stationPlaceholder = data));
    }
  }

  public onSelectStation(event, trigger?: MatAutocompleteTrigger): void {
    this.station.clearValidators();
    this.station.updateValueAndValidity();
    this.blurOnOption = false;
    const selectedValue = this.stations.find((ob) => ob.name === event.option.value);
    const tempItem = {
      name: selectedValue.name,
      id: selectedValue.id
    };
    const newValue = event.option.value;
    if (this.selectedStation.map((it) => it.name).includes(newValue)) {
      this.selectedStation = this.selectedStation.filter((item) => item.name !== newValue);
    } else {
      this.selectedStation.push(tempItem);
    }

    this.station.setValidators(this.stationValidator());
    this.station.setValue('');
    this.setStationPlaceholder();
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
    this.isCardExist = false;
  }

  public deleteStation(index): void {
    this.selectedStation.splice(index, 1);
    this.setStationPlaceholder();
    this.station.setValidators(this.stationValidator());
  }

  public checkStation(item): boolean {
    return this.selectedStation.map((it) => it.name).includes(item);
  }

  private getRegionNameByLanguageCode(selectedValue: any[], languageCode: string): string {
    const result = selectedValue.flatMap((it) => it.regionTranslationDtos).find((ob) => ob.languageCode === languageCode);

    return result?.regionName;
  }

  public onRegionSelected(event): void {
    const selectedValue = this.locations.filter((it) => it.regionTranslationDtos.find((ob) => ob.regionName === event.value));

    this.regionEnglishName = this.getRegionNameByLanguageCode(selectedValue, Language.EN);
    this.regionUkrainianName = this.getRegionNameByLanguageCode(selectedValue, Language.UA);
    this.currentRegionTranslated = this.getLangValue(this.regionEnglishName, this.regionUkrainianName);

    this.regionId = selectedValue.find((it) => it.regionId).regionId;
    const currentRegion = this.locations.filter((element) => element.regionTranslationDtos.find((it) => it.regionName === event.value));
    if (!currentRegion?.length || !currentRegion[0].locationsDto) {
      return;
    }
    this.selectedCities = [];
    this.setCountOfSelectedCity();
    this.filteredCities = currentRegion[0].locationsDto;

    this.city.valueChanges.subscribe((data) => {
      if (!data) {
        this.filteredCities = currentRegion[0].locationsDto;
      }
      this.city.setValidators(this.cityValidator());
    });

    event.value ? this.city.enable() : this.city.disable();
    this.isCardExist = false;
  }

  getTranslatedLocationName(city): string {
    return city.locationTranslationDtoList.find((t) => t.languageCode === this.currentLanguage).locationName;
  }

  public selected(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    this.blurOnOption = false;
    this.city.clearValidators();
    this.city.updateValueAndValidity();
    this.selectCity(event);
    this.setCountOfSelectedCity();
    this.city.setValue('');
    this.city.setValidators(this.cityValidator());
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
  }

  public selectCity(event: MatAutocompleteSelectedEvent): void {
    let location;
    let englishLocation;
    let locationId;
    event.option.value.locationTranslationDtoList.forEach((el) => {
      if (el.languageCode === Language.UA) {
        location = el.locationName;
      }
      if (el.languageCode === Language.EN) {
        englishLocation = el.locationName;
      }
      locationId = event.option.value.locationId;
    });

    const tempItem = { location, englishLocation, locationId };
    const newValue = event.option.viewValue;

    const existingCity = this.selectedCities.find((it) => it.location.includes(newValue) || it.englishLocation.includes(newValue));
    if (existingCity) {
      this.selectedCities = this.selectedCities.filter((item) => item.location !== newValue && item.englishLocation !== newValue);
      this.checkIfLocationUsed();
    } else {
      this.selectedCities.push(tempItem);
      this.checkIfLocationUsed();
    }
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  public checkCity(item): boolean {
    this.isCardExist = false;
    return this.selectedCities.map((it) => it.location).includes(item);
  }

  public setCountOfSelectedCity(): void {
    this.selectedCityLength = this.selectedCities.length;
    if (this.selectedCityLength) {
      this.citySelected = true;
      this.cityPlaceholder = this.tariffsService.getPlaceholderValue(this.selectedCityLength);
      this.cityPlaceholderTranslated = this.tariffsService.getPlaceholderValue(this.selectedCityLength, true);
    } else {
      this.citySelected = false;
      this.translate.get('ubs-tariffs.placeholder-choose-city').subscribe((data) => {
        this.cityPlaceholder = data;
      });
    }
  }

  public deleteCity(index): void {
    this.selectedCities.splice(index, 1);
    this.setCountOfSelectedCity();
    this.city.setValidators(this.cityValidator());
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger, flag: boolean): void {
    if (!flag) {
      event.stopPropagation();
      trigger.openPanel();
    }
  }

  public _filterOptions(name: string, items: any[]): any[] {
    const filterValue = name.toLowerCase();
    return items.filter((option) => option.toLowerCase().includes(filterValue));
  }

  public createCardDto() {
    this.createCardObj = {
      courierId: this.courierId,
      receivingStationsIdList: this.selectedStation.map((it) => it.id),
      regionId: this.regionId,
      locationIdList: this.selectedCities.map((it) => it.locationId)
    };
  }

  public createCardRequest(card) {
    this.tariffsService.createCard(card).pipe(takeUntil(this.unsubscribe)).subscribe();
  }

  public editCard(): void {
    const body = {
      courierId: this.courierId,
      locationIds: this.selectedCities.map((val) => val.locationId),
      receivingStationIds: this.selectedStation.map((station) => station.id)
    };

    const newValueOfCard = {
      citiesEn: this.selectedCities.map((city) => city.englishLocation),
      citiesUk: this.selectedCities.map((city) => city.location),
      courierEn: this.courierEnglishName,
      courierUk: this.courierUkrainianName,
      regionEn: this.regionEnglishName,
      regionUk: this.regionUkrainianName,
      regionId: this.regionId,
      station: this.selectedStation.map((it) => it.name)
    };

    this.tariffsService
      .editTariffInfo(body, this.tariffId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.dialogRef.close(newValueOfCard);
        this.snackBar.openSnackBar('successUpdateUbsData');
      });
  }

  fillFields(modalData) {
    if (modalData) {
      const { courierUkrainianName, courierEnglishName, regionEnglishName, selectedStation, regionUkrainianName, cityNameUk, cityNameEn } =
        this.modalData;

      this.CardForm.patchValue({
        courierName: this.getLangValue(courierUkrainianName, courierEnglishName),
        regionName: this.getLangValue(regionUkrainianName, regionEnglishName),
        station: selectedStation,
        city: this.getLangValue(cityNameUk, cityNameEn)
      });

      this.currentCourierNameTranslated = this.getLangValue(courierEnglishName, courierUkrainianName);
      this.currentRegionTranslated = this.getLangValue(regionEnglishName, regionUkrainianName);
    }
  }

  public createCard(): void {
    this.createCardDto();
    this.tariffsService
      .checkIfCardExist(this.createCardObj)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.isCardExist = response;

        if (!this.isCardExist) {
          this.dialogRef.close();
          const matDialogRef = this.dialog.open(TariffConfirmationPopUpComponent, {
            disableClose: true,
            hasBackdrop: true,
            panelClass: 'address-matDialog-styles-w-100',
            data: {
              title: 'ubs-tariffs-add-location-pop-up.create_card_title',
              courierNameUa: this.courierUkrainianName,
              courierNameEn: this.courierEnglishName,
              stationNames: this.selectedStation.map((it) => it.name),
              regionNameUa: this.regionUkrainianName,
              regionNameEn: this.regionEnglishName,
              locationNames: this.selectedCities,
              action: 'ubs-tariffs-add-location-pop-up.create_button'
            } as TariffConfirmationPopUpInterface
          });
          matDialogRef.afterClosed().subscribe((res) => {
            if (res) {
              this.createCardRequest(this.createCardObj);
              this.snackBar.openSnackBar('successUpdateUbsData');
            }
          });
        }
      });
  }

  public onNoClick(): void {
    if (this.selectedCities.length || this.selectedStation.length) {
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
