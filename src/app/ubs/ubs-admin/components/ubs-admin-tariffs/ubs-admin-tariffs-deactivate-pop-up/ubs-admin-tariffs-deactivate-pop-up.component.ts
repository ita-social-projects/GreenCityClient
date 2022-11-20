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
  public locations;
  public filteredRegions;
  public selectedRegions = [];
  public selectedRegionsLength: number;
  public regionPlaceholder: string;
  public stations;
  public filteredStations;
  public selectedStation = [];
  public stationPlaceholder: string;
  public currentCities = [];
  public filteredCities = [];
  public selectedCities = [];
  public cityPlaceholder: string;
  public selectedCityLength: number;
  public reset = true;
  public courierId: number;
  public regionId: number;
  public createCardObj: CreateCard;
  public blurOnOption = false;
  public isCardExist;
  public currentLanguage: string;

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

  public getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.couriers = res;
        this.couriersName = this.couriers.map((it) => it.courierTranslationDtos.map((el) => el.name)).flat(2);
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
            map((value: string) => this.filterOptions(value, stationsName))
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
      const regionsName = this.locations
        .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName))
        .flat(2);
      this.region.valueChanges
        .pipe(
          startWith(''),
          map((value: string) => this.filterOptions(value, regionsName))
        )
        .subscribe((data) => {
          this.filteredRegions = data;
        });
    });
  }

  public onSelectCourier(event): void {
    const selectedValue = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => ob.name === event.value));
    this.courierId = selectedValue.find((it) => it.courierId).courierId;
  }

  public selectStation(event: MatAutocompleteSelectedEvent, trigger: MatAutocompleteTrigger): void {
    this.station.clearValidators();
    this.station.updateValueAndValidity();
    this.blurOnOption = false;
    this.addSelectedStation(event);
    this.station.setValue('');
    this.setStationPlaceholder();
    requestAnimationFrame(() => {
      trigger.openPanel();
    });
  }

  public addSelectedStation(event: MatAutocompleteSelectedEvent): void {
    const selectedItem = this.stations.find((it) => it.name === event.option.value);
    const tempItem = {
      id: selectedItem.id,
      name: selectedItem.name
    };
    const itemIncluded = this.selectedStation.find((it) => it.id === tempItem.id);
    if (itemIncluded) {
      this.selectedStation = this.selectedStation.filter((item) => item.id !== tempItem.id);
    }
    if (!itemIncluded) {
      this.selectedStation.push(tempItem);
    }
  }

  public setStationPlaceholder(): void {
    if (this.selectedStation.length) {
      this.stationPlaceholder = this.selectedStation.length + ' вибрано';
    } else {
      this.translate.get('ubs-tariffs.placeholder-choose-station').subscribe((data) => (this.stationPlaceholder = data));
    }
  }

  public deleteStation(index): void {
    this.selectedStation.splice(index, 1);
    this.setStationPlaceholder();
  }

  public checkStation(item): boolean {
    return this.selectedStation.map((it) => it.name).includes(item);
  }

  public selectRegion(event: MatAutocompleteSelectedEvent, trigger: MatAutocompleteTrigger): void {
    this.blurOnOption = false;
    this.region.clearValidators();
    this.region.updateValueAndValidity();
    this.addSelectedRegion(event);
    this.setRegionsPlaceholder();
    this.region.setValue('');
    requestAnimationFrame(() => {
      trigger.openPanel();
    });
    if (this.selectedRegions.length === 1) {
      this.onRegionSelected(this.selectedRegions[0].id);
    }
    if (this.selectedRegions.length > 1 || this.selectedRegions.length < 1) {
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
      this.onRegionSelected(this.selectedRegions[0].id);
    }
    if (this.selectedRegions.length > 1 || this.selectedRegions.length < 1) {
      this.disableCity();
    }
  }

  public onRegionSelected(regionId: number): void {
    const currentRegion = this.locations.filter((element) => element.regionId === regionId);
    this.currentCities = currentRegion[0].locationsDto;
    const currentCitiesName = this.currentCities
      .map((element) => element.locationTranslationDtoList.filter((it) => it.languageCode === 'ua').map((it) => it.locationName))
      .flat(2);
    this.city.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this.filterOptions(value, currentCitiesName))
      )
      .subscribe((data) => {
        this.filteredCities = data;
      });
    this.city.enable();
  }

  public selectCity(event: MatAutocompleteSelectedEvent, trigger: MatAutocompleteTrigger): void {
    this.blurOnOption = false;
    this.city.clearValidators();
    this.city.updateValueAndValidity();
    this.addSelectedCity(event);
    this.setCityPlaceholder();
    this.city.setValue('');
    requestAnimationFrame(() => {
      trigger.openPanel();
    });
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

  public disableCity(): void {
    this.city.setValue('');
    this.selectedCities = [];
    this.setCityPlaceholder();
    this.city.disable();
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
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger, flag: boolean): void {
    if (!flag) {
      event.stopPropagation();
      trigger.openPanel();
    }
  }

  public filterOptions(name: string, items: any[]): any[] {
    const filterValue = name.toLowerCase();
    return items.filter((option) => option.toLowerCase().includes(filterValue));
  }
}
