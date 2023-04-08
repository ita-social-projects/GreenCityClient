import { Language } from 'src/app/main/i18n/Language';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-ubs-admin-tariffs-card-pop-up',
  templateUrl: './ubs-admin-tariffs-card-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-card-pop-up.component.scss']
})
export class UbsAdminTariffsCardPopUpComponent implements OnInit, OnDestroy {
  CardForm = this.fb.group({
    courierName: ['', Validators.required],
    courierNameEng: [''],
    station: ['', Validators.required],
    regionNameUk: ['', Validators.required],
    regionNameEng: [''],
    city: ['', [Validators.maxLength(40), Validators.required]]
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
  public locations: Locations[];
  public regions;
  public regionEnglishName;
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

  currentCourierName: string;
  currentCourierNameEng: string;
  currentCity: string;
  currentStation: string;
  regionEng: string;
  isEdit: boolean;
  isCreate: boolean;
  tariffId: number;
  isLocationAlreadyUsed: boolean;

  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private localeStorageService: LocalStorageService,
    private tariffsService: TariffsService,
    private store: Store<IAppState>,
    private translate: TranslateService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsCardPopUpComponent>,
    public languageService: LanguageService
  ) {}

  get courier() {
    return this.CardForm.get('courierName');
  }
  get station() {
    return this.CardForm.get('station');
  }
  get region() {
    return this.CardForm.get('regionNameUk');
  }
  get city() {
    return this.CardForm.get('city');
  }

  ngOnInit(): void {
    this.isEdit = this.modalData.edit;
    this.isCreate = this.modalData.create;
    this.currentCourierName = this.modalData.courierName;
    this.currentCity = this.modalData.city;
    this.currentStation = this.modalData.selectedStation;
    this.currentCourierNameEng = this.modalData.courierEnglishName;
    this.regionEng = this.modalData.regionEnglishName;
    this.tariffId = this.modalData.tariffId;
    this.regionEnglishName = this.modalData.regionName;

    if (this.isEdit) {
      this.fillFields(this.modalData);
    }
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
    this.localeStorageService.languageBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.datePipe = new DatePipe(this.currentLanguage);
      this.newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
    });
    this.setStationPlaceholder();
    // this.setCountOfSelectedCity();
    setTimeout(() => this.city.disable());
    this.getCouriers();
    this.getReceivingStation();
    this.getLocations();
    this.setCountOfSelectedCity();
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
        this.couriersName = this.couriers.map((item) => this.languageService.getLangValue(item.nameUk, item.nameEn));
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
      }
    });
  }

  public onSelectCourier(event): void {
    const selectedValue = this.couriers.find((ob) => ob.nameUk === event.value);
    this.courierEnglishName = selectedValue.nameEn;
    this.courierId = selectedValue.courierId;
  }

  public setStationPlaceholder(): void {
    if (this.selectedStation.length) {
      this.stationPlaceholder = this.selectedStation.length + ' вибрано';
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
  }

  public deleteStation(index): void {
    this.selectedStation.splice(index, 1);
    this.setStationPlaceholder();
    this.station.setValidators(this.stationValidator());
  }

  public checkStation(item): boolean {
    return this.selectedStation.map((it) => it.name).includes(item);
  }

  public onRegionSelected(event): void {
    const selectedValue = this.locations.filter((it) => it.regionTranslationDtos.find((ob) => ob.regionName === event.value));
    this.regionEnglishName = selectedValue
      .map((it) => it.regionTranslationDtos.filter((ob) => ob.languageCode === Language.EN).map((i) => i.regionName))
      .flat(2);
    this.regionId = selectedValue.find((it) => it.regionId).regionId;
    const currentRegion = this.locations.filter((element) => element.regionTranslationDtos.find((it) => it.regionName === event.value));
    if (!currentRegion || !currentRegion.length || !currentRegion[0].locationsDto) {
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
      const res = [];
      this.filteredCities.forEach((elem, index) => {
        elem.locationTranslationDtoList.forEach((el) => {
          if (el.locationName.toLowerCase().includes(data) && el.languageCode === this.currentLanguage) {
            res.push(this.filteredCities[index]);
          }
        });
      });
      this.filteredCities = res;
    });
    if (event.value) {
      this.city.enable();
    } else {
      this.city.disable();
    }
  }

  public selected(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    this.blurOnOption = false;
    this.city.clearValidators();
    this.city.updateValueAndValidity();
    this.selectCity(event);
    this.setCountOfSelectedCity();
    this.city.setValue('' || []);
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
    if (this.selectedCities.find((it) => it.location.includes(newValue))) {
      this.selectedCities = this.selectedCities.filter((item) => item.location !== newValue);
      this.checkIfLocationUsed();
    } else {
      this.selectedCities.push(tempItem);
      this.checkIfLocationUsed();
    }
  }

  public checkCity(item): boolean {
    return this.selectedCities.map((it) => it.location).includes(item);
  }

  public setCountOfSelectedCity(): void {
    this.selectedCityLength = this.selectedCities.length;
    if (this.selectedCityLength) {
      this.citySelected = true;
      this.cityPlaceholder = this.selectedCityLength + ' вибрано';
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
      receivingStationsIdList: this.selectedStation.map((it) => it.id).sort(),
      regionId: this.regionId,
      locationIdList: this.selectedCities.map((it) => it.locationId).sort()
    };
  }

  public createCardRequest(card) {
    this.tariffsService.createCard(card).pipe(takeUntil(this.unsubscribe)).subscribe();
  }

  public editCard(): void {
    const body = {
      locationIds: this.selectedCities.map((val) => val.locationId),
      receivingStationIds: this.selectedStation.map((station) => station.id)
    };

    this.tariffsService
      .editTariffInfo(body, this.tariffId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.dialogRef.close());
  }

  fillFields(modalData) {
    if (modalData) {
      const { courierNameUk, courierEnglishName, regionEnglishName, station, regionNameUk, city } = this.modalData;
      this.CardForm.patchValue({
        courierName: courierNameUk,
        courierNameEng: courierEnglishName,
        regionNameUk,
        regionNameEng: regionEnglishName,
        station,
        city
      });
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
            hasBackdrop: true,
            panelClass: 'address-matDialog-styles-w-100',
            data: {
              title: 'ubs-tariffs-add-location-pop-up.create_card_title',
              courierName: this.courier.value,
              courierEnglishName: this.courierEnglishName,
              stationNames: this.selectedStation.map((it) => it.name),
              regionName: this.region.value,
              regionEnglishName: this.regionEnglishName,
              locationNames: this.selectedCities.map((it) => this.languageService.getLangValue(it.location, it.englishLocation)),
              action: 'ubs-tariffs-add-location-pop-up.create_button'
            }
          });
          matDialogRef.afterClosed().subscribe((res) => {
            if (res) {
              this.createCardRequest(this.createCardObj);
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
