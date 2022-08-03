import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TariffsService } from '../../services/tariffs.service';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { Couriers, Locations, Stations } from '../../models/tariffs.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up/ubs-admin-tariffs-location-pop-up.component';
import { Store } from '@ngrx/store';
import { MatChipInputEvent } from '@angular/material/chips';

import { IAppState } from 'src/app/store/state/app.state';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { UbsAdminTariffsCourierPopUpComponent } from './ubs-admin-tariffs-courier-pop-up/ubs-admin-tariffs-courier-pop-up.component';
import { UbsAdminTariffsStationPopUpComponent } from './ubs-admin-tariffs-station-pop-up/ubs-admin-tariffs-station-pop-up.component';
import { UbsAdminTariffsCardPopUpComponent } from './ubs-admin-tariffs-card-pop-up/ubs-admin-tariffs-card-pop-up.component';
import { TranslateService } from '@ngx-translate/core';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-ubs-admin-tariffs-location-dashboard',
  templateUrl: './ubs-admin-tariffs-location-dashboard.component.html',
  styleUrls: ['./ubs-admin-tariffs-location-dashboard.component.scss']
})
export class UbsAdminTariffsLocationDashboardComponent implements OnInit, OnDestroy {
  @Input() showTitle = true;
  @Input() locationCard: Locations;
  @Input() textBack: TemplateRef<any>;

  locations: Locations[];
  stations: Stations[];
  stationName: Array<string> = [];
  couriers: Couriers[];
  couriersName: Array<string>;
  searchForm: FormGroup;
  reset = true;
  checkedCities = [];
  cities = [];

  allSelected = false;
  filteredRegions;
  filteredCities;
  filteredStations;
  cityPlaceholder: string;
  stationPlaceholder: string;
  selectedStation = [];
  cards = [];
  filterData = { status: 'ACTIVE' };

  private destroy: Subject<boolean> = new Subject<boolean>();

  mainUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=uk';
  public icons = {
    setting: './assets/img/ubs-tariff/setting.svg',
    crumbs: './assets/img/ubs-tariff/crumbs.svg',
    restore: './assets/img/ubs-tariff/restore.svg',
    arrowDown: './assets/img/ubs-tariff/arrow-down.svg',
    arrowRight: './assets/img/ubs-tariff/arrow-right.svg'
  };
  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);

  constructor(
    private tariffsService: TariffsService,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<IAppState>,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}

  get region() {
    return this.searchForm.get('region');
  }
  get city() {
    return this.searchForm.get('city');
  }
  get courier() {
    return this.searchForm.get('courier');
  }
  get station() {
    return this.searchForm.get('station');
  }
  get state() {
    return this.searchForm.get('state');
  }

  ngOnInit(): void {
    this.initForm();
    this.getLocations();
    this.getCouriers();
    this.getReceivingStation();
    this.loadScript();
    this.region.valueChanges.subscribe((value) => {
      this.checkRegionValue(value);
      this.checkedCities = [];
    });
    this.setCountOfCheckedCity();
    this.setStationPlaceholder();
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      region: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]],
      city: ['', [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]],
      courier: ['', [Validators.required]],
      station: ['', [Validators.required]],
      state: ['Активно']
    });
  }

  public _filter(name: string, items: any[]): any[] {
    const filterValue = name.toLowerCase();
    return items.filter((option) => option.toLowerCase().includes(filterValue));
  }

  addItem(event: MatChipInputEvent): void {
    const value = event.value;

    if ((value || '').trim()) {
      this.checkedCities.push(value.trim());
    }

    if (this.city.value) {
      this.city.setValue('');
    }
  }

  public setCountOfCheckedCity(): void {
    if (this.checkedCities.length) {
      this.cityPlaceholder = `${this.checkedCities.length} вибрано`;
    } else {
      this.translate.get('ubs-tariffs.placeholder-locality').subscribe((data) => (this.cityPlaceholder = data));
    }
  }

  selected(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    if (event.option.value === 'all') {
      this.toggleSelectAllCity();
      const locationsId = this.locations.map((location) => location.locationsDto.map((elem) => elem.locationId)).flat(2);
      Object.assign(this.filterData, { location: locationsId });
    } else {
      this.selectCity(event);
      const locationId = this.checkedCities.map((it) => it.id);
      Object.assign(this.filterData, { location: locationId });
    }
    this.getExistingCard(this.filterData);
    this.setCountOfCheckedCity();
    this.city.setValue('');
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
  }

  selectCity(event: MatAutocompleteSelectedEvent): void {
    const selectedLocation = this.locations.find((location) =>
      location.locationsDto.find((locationName) =>
        locationName.locationTranslationDtoList.find((name) => name.locationName === event.option.viewValue)
      )
    );
    const selectedCity = selectedLocation.locationsDto.find((name) =>
      name.locationTranslationDtoList.find((elem) => elem.locationName === event.option.viewValue)
    );
    const selectedCityId = selectedCity.locationId;
    const selectedCityName = selectedCity.locationTranslationDtoList
      .filter((it) => it.languageCode === 'ua')
      .map((it) => it.locationName)
      .join();
    const tempItem = {
      name: selectedCityName,
      id: selectedCityId
    };
    const newValue = event.option.viewValue;
    if (this.checkedCities.map((it) => it.name).includes(newValue)) {
      this.checkedCities = this.checkedCities.filter((item) => item.name !== newValue);
    } else {
      this.checkedCities.push(tempItem);
    }
  }

  public onSelectStation(event: MatAutocompleteSelectedEvent): void {
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
  }

  public stationSelected(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger) {
    if (event.option.value === 'all') {
      this.toggleSelectAllStation();
      const stationsId = this.stations.map((station) => station.id);
      Object.assign(this.filterData, { receivingStation: stationsId });
    } else {
      this.onSelectStation(event);
      const receivingStationId = this.selectedStation.map((it) => it.id);
      Object.assign(this.filterData, { receivingStation: receivingStationId });
    }
    this.getExistingCard(this.filterData);
    this.station.setValue('');
    this.setStationPlaceholder();
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
  }

  public checkSelectedItem(item, array): boolean {
    return array.map((it) => it.name).includes(item);
  }

  public setStationPlaceholder(): void {
    if (this.selectedStation.length) {
      this.stationPlaceholder = `${this.selectedStation.length} вибрано`;
    } else {
      this.translate.get('ubs-tariffs.placeholder-station').subscribe((data) => (this.stationPlaceholder = data));
    }
  }

  isCityChecked(): boolean {
    return this.checkedCities.length === this.cities.length;
  }

  isStationChecked(): boolean {
    return this.selectedStation.length === this.stationName.length;
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  toggleSelectAllCity(): void {
    if (!this.isCityChecked()) {
      this.checkedCities.length = 0;
      this.cities.forEach((city) => {
        this.checkedCities.push({
          name: city.name,
          id: city.id
        });
      });
    } else {
      this.checkedCities.length = 0;
    }
  }

  toggleSelectAllStation(): void {
    if (!this.isStationChecked()) {
      this.selectedStation.length = 0;
      this.stations.forEach((station) => {
        this.selectedStation.push({
          name: station.name,
          id: station.id
        });
      });
    } else {
      this.selectedStation.length = 0;
    }
  }

  public onSelectCourier(event): void {
    if (event.value === 'all') {
      Object.assign(this.filterData, { courier: '' });
    } else {
      const selectedValue = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => ob.name === event.value));
      const courierId = selectedValue.find((it) => it.courierId).courierId;
      Object.assign(this.filterData, { courier: courierId });
    }
    this.getExistingCard(this.filterData);
  }

  public onSelectState(event): void {
    switch (event.value) {
      case 'all':
        Object.assign(this.filterData, { status: '' });
        break;
      case 'Активно':
        Object.assign(this.filterData, { status: 'ACTIVE' });
        break;
      case 'Неактивно':
        Object.assign(this.filterData, { status: 'DEACTIVATED' });
        break;
      case 'Незаповнена':
        Object.assign(this.filterData, { status: 'NEW' });
        break;
    }
    this.getExistingCard(this.filterData);
  }

  loadScript(): void {
    const script = document.getElementById('googleMaps') as HTMLScriptElement;
    if (script) {
      script.src = this.mainUrl;
    } else {
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.setAttribute('src', this.mainUrl);
      document.getElementsByTagName('head')[0].appendChild(google);
    }
  }

  getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));

    this.locations$.pipe(skip(1)).subscribe((item) => {
      if (item) {
        this.locations = item;
        const regions = this.locations
          .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName))
          .flat(2);
        this.filteredRegions = this.filterOptions(this.region, regions);
        this.cities = this.mapCitiesInUkr(this.locations);
        this.filteredCities = this.filterOptions(
          this.city,
          this.cities.map((elem) => elem.name)
        );
        this.reset = false;
      }
    });
  }

  public mapCitiesInUkr(region): Array<object> {
    const cityArray = [];
    region.map((element) =>
      element.locationsDto.forEach((el) => {
        const tempItem = {
          name: el.locationTranslationDtoList
            .filter((it) => it.languageCode === 'ua')
            .map((it) => it.locationName)
            .join(),
          id: el.locationId
        };
        cityArray.push(tempItem);
      })
    );
    return cityArray;
  }

  page(locationID): void {
    this.router.navigate([`ubs-admin/tariffs/location/${locationID}`]);
  }

  getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res;
        this.couriersName = this.couriers
          .map((it) => it.courierTranslationDtos.filter((ob) => ob.languageCode === 'ua').map((el) => el.name))
          .flat(2);
      });
  }

  getReceivingStation(): void {
    this.tariffsService
      .getAllStations()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.stations = res;
        this.stationName = this.stations.map((el) => el.name);
        this.filteredStations = this.filterOptions(this.station, this.stationName);
      });
  }

  public getExistingCard(filterData) {
    this.cards = [];
    this.tariffsService
      .getFilteredCard(filterData)
      .pipe(takeUntil(this.destroy))
      .subscribe((card) => {
        card.forEach((el) => {
          const cardObj = {
            courier: el.courierTranslationDtos
              .filter((ob) => ob.languageCode === 'ua')
              .map((it) => it.name)
              .join(),
            station: el.receivingStationDtos.map((it) => it.name),
            region: el.regionDto.nameUk,
            city: el.locationInfoDtos.map((it) => it.nameUk),
            tariff: el.tariffStatus,
            regionId: el.regionDto.regionId
          };
          this.cards.push(cardObj);
        });
      });
  }

  checkRegionValue(value): void {
    let currentRegion;
    if (value === 'Усі' || value === '') {
      currentRegion = this.locations;
    } else {
      currentRegion = this.locations.filter((element) => element.regionTranslationDtos.find((it) => it.regionName === value));
    }
    this.cities = this.mapCitiesInUkr(currentRegion);
    this.filteredCities = this.filterOptions(
      this.city,
      this.cities.map((elem) => elem.name)
    );
  }

  public regionSelected(event) {
    if (event.option.value === 'Усі') {
      Object.assign(this.filterData, { region: '' });
    } else {
      const selectedValue = this.locations.filter((it) =>
        it.regionTranslationDtos.find((ob) => ob.regionName === event.option.value.toString())
      );
      const regionId = selectedValue.find((it) => it.regionId).regionId;
      Object.assign(this.filterData, { region: regionId });
    }
    this.getExistingCard(this.filterData);
  }

  filterOptions(control, array): Array<string> {
    return control.valueChanges.pipe(
      startWith(''),
      map((value: string) => (value ? this._filter(value, array) : array.slice()))
    );
  }

  openAddCourierDialog(): void {
    this.dialog.open(UbsAdminTariffsCourierPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'addCourier',
        edit: false
      }
    });
  }

  openEditCourier(): void {
    this.dialog.open(UbsAdminTariffsCourierPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'editCourier',
        edit: true
      }
    });
  }

  openAddStationDialog(): void {
    this.dialog.open(UbsAdminTariffsStationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'addStation',
        edit: false
      }
    });
  }

  openEditStation(): void {
    this.dialog.open(UbsAdminTariffsStationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'editStation',
        edit: true
      }
    });
  }

  openAddLocation(): void {
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'addLocation',
        edit: false
      }
    });
  }

  openEditLocation(): void {
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'editLocation',
        edit: true
      }
    });
  }

  openDeactivateLocation(): void {
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'deactivateTemplate'
      }
    });
  }

  public openCreateCard(): void {
    this.dialog.open(UbsAdminTariffsCardPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'createCard'
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
