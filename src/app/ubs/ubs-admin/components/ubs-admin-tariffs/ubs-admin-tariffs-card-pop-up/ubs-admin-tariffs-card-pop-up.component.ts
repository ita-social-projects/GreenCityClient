import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
  selector: 'app-ubs-admin-tariffs-card-pop-up',
  templateUrl: './ubs-admin-tariffs-card-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-card-pop-up.component.scss']
})
export class UbsAdminTariffsCardPopUpComponent implements OnInit, OnDestroy {
  CardForm = this.fb.group({
    courier: ['', Validators.required],
    station: ['', Validators.required],
    region: ['', Validators.required],
    city: [{ value: '', disabled: true }, [Validators.maxLength(40), Validators.required]]
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
  public courierEnglishName;
  public locations;
  public regions;
  public regionEnglishName;
  public stations;
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

  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);

  constructor(
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    private tariffsService: TariffsService,
    private store: Store<IAppState>,
    private translate: TranslateService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsCardPopUpComponent>
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
    this.setCountOfSelectedCity();
    setTimeout(() => this.city.disable());
    this.getCouriers();
    this.getReceivingStation();
    this.getLocations();
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
      .subscribe((res) => {
        this.couriers = res;
        this.couriersName = this.couriers.map((it) => it.courierTranslationDtos.map((item) => item.name).flat(2));
      });
  }

  public getReceivingStation(): void {
    this.tariffsService
      .getAllStations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
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

    this.locations$.pipe(skip(1)).subscribe((item) => {
      if (item) {
        this.locations = item;
        this.regions = this.locations
          .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName))
          .flat(2);
      }
    });
  }

  public onSelectCourier(event): void {
    const selectedValue = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => ob.name === event.value[0]));
    this.courierEnglishName = selectedValue.map((it) => it.courierTranslationDtos.map((i) => i.nameEng).flat());
    this.courierId = selectedValue.find((it) => it.courierId).courierId;
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
      .map((it) => it.regionTranslationDtos.filter((ob) => ob.languageCode === 'en').map((i) => i.regionName))
      .flat(2);
    this.regionId = selectedValue.find((it) => it.regionId).regionId;
    const currentRegion = this.locations.filter((element) => element.regionTranslationDtos.find((it) => it.regionName === event.value));
    if (!currentRegion || !currentRegion.length || !currentRegion[0].locationsDto) {
      return;
    }
    this.filteredCities = currentRegion[0].locationsDto;
    this.city.valueChanges.subscribe((data) => {
      if (!data) {
        this.filteredCities = currentRegion[0].locationsDto;
      }
      this.city.setValidators(this.cityValidator());
      const res = [];
      this.filteredCities.forEach((elem, index) => {
        elem.locationTranslationDtoList.forEach((el) => {
          if (el.locationName.toLowerCase().includes(data) && el.languageCode === 'ua') {
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
      if (el.languageCode === 'ua') {
        location = el.locationName;
      }
      if (el.languageCode === 'en') {
        englishLocation = el.locationName;
      }
      locationId = event.option.value.locationId;
    });
    const tempItem = { location, englishLocation, locationId };
    const newValue = event.option.viewValue;
    if (this.selectedCities.find((it) => it.location.includes(newValue))) {
      this.selectedCities = this.selectedCities.filter((item) => item.location !== newValue);
    } else {
      this.selectedCities.push(tempItem);
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
      this.translate.get('ubs-tariffs.placeholder-choose-city').subscribe((data) => (this.cityPlaceholder = data));
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
              locationNames: this.selectedCities.map((it) => it.location),
              locationEnglishNames: this.selectedCities.map((it) => it.englishLocation),
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
