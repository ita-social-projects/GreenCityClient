import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TariffsService } from '../../services/tariffs.service';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { Locations } from '../../models/tariffs.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up/ubs-admin-tariffs-location-pop-up.component';
import { Store } from '@ngrx/store';
import { MatChipInputEvent } from '@angular/material/chips';

import { IAppState } from 'src/app/store/state/app.state';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { UbsAdminTariffsCourierPopUpComponent } from './ubs-admin-tariffs-courier-pop-up/ubs-admin-tariffs-courier-pop-up.component';
import { UbsAdminTariffsStationPopUpComponent } from './ubs-admin-tariffs-station-pop-up/ubs-admin-tariffs-station-pop-up.component';
import { ubsNamePattern } from '../shared/validators-pattern/ubs-name-patterns';

@Component({
  selector: 'app-ubs-admin-tariffs-location-dashboard',
  templateUrl: './ubs-admin-tariffs-location-dashboard.component.html',
  styleUrls: ['./ubs-admin-tariffs-location-dashboard.component.scss']
})
export class UbsAdminTariffsLocationDashboardComponent implements OnInit, OnDestroy {
  @Input() showTitle = true;
  @Input() locationCard: Locations;
  @Input() textBack: TemplateRef<any>;

  locations = [];
  selectedLocationId;
  couriers;
  stations;
  reset = true;
  checkedCities = [];
  currentRegion;

  searchForm;
  regions = [];
  cities = [];

  allSelected = false;
  filteredRegions;
  filteredCities;
  filteredLocations = [];
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
    private fb: FormBuilder
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
    setTimeout(() => this.city.disable());
    this.getLocations();
    this.getCouriers();
    this.getReceivingStation();
    this.loadScript();
    this.region.valueChanges.subscribe((value) => {
      this.checkRegionValue(value);
      this.checkedCities = [];
      this.positionsFilter();
    });
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      region: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(ubsNamePattern.namePattern)]
      ],
      city: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(40), Validators.pattern(ubsNamePattern.namePattern)]
      ],
      courier: ['', [Validators.required]],
      station: ['', [Validators.required]],
      state: ['all']
    });
  }

  private _filter(name: string, items: any[]): any[] {
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

  selected(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    if (event.option.value === 'all') {
      this.toggleSelectAll();
    } else {
      this.selectCity(event);
    }
    this.positionsFilter();
    this.city.setValue('');
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
  }

  selectCity(event: MatAutocompleteSelectedEvent): void {
    const newValue = event.option.viewValue;
    if (this.checkedCities.includes(newValue)) {
      this.checkedCities = [...this.checkedCities.filter((item) => item !== newValue)];
    } else {
      this.checkedCities.push(event.option.viewValue);
    }
  }

  isChecked(): boolean {
    return this.checkedCities.length === this.cities.length;
  }

  isEmpty(): boolean {
    return this.filteredLocations.length === 0;
  }

  positionsFilter(): void {
    if (this.checkedCities.length !== 0) {
      this.filteredLocations = this.onPositionSelected();
    } else {
      this.filteredLocations = this.locations;
    }
  }

  onPositionSelected(): any[] {
    const isEmpty = (a) => Array.isArray(a) && a.every(isEmpty);
    return this.locations.filter((user) => {
      const res = user.locationsDto.map((it) =>
        it.locationTranslationDtoList.filter((item) => this.checkedCities.includes(item.locationName))
      );
      if (!isEmpty(res)) {
        return true;
      }
    });
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger, flag: boolean): void {
    if (!flag) {
      event.stopPropagation();
      trigger.openPanel();
    }
  }

  toggleSelectAll(): void {
    if (!this.isChecked()) {
      this.checkedCities.length = 0;
      this.cities.forEach((row) => {
        this.checkedCities.push(row);
      });
    } else {
      this.checkedCities.length = 0;
    }
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
        const key = 'content';
        this.locations = item[key];
        this.filteredLocations = this.locations;
        this.regions = [].concat(
          ...this.locations.map((element) =>
            element.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName)
          )
        );
        this.filteredRegions = this.region.valueChanges.pipe(
          startWith(''),
          map((value: string) => this._filter(value, this.regions))
        );
        this.reset = false;
      }
    });
  }

  page(locationID): void {
    this.router.navigate([`ubs-admin/tariffs/location/${locationID}`]);
  }

  getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res.map((it) => it.courierTranslationDtos.filter((ob) => ob.languageCode === 'ua').map((el) => el.name));
      });
  }

  getReceivingStation(): void {
    this.tariffsService
      .getAllStations()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.stations = res;
      });
  }

  checkRegionValue(value): void {
    if (value === 'Усі') {
      this.currentRegion = this.locations;
    } else {
      this.currentRegion = this.locations.filter((element) => element.regionTranslationDtos.find((it) => it.regionName === value));
    }
    if (value && this.selectCities(this.currentRegion)) {
      this.city.enable();
    } else {
      this.city.disable();
    }
  }

  selectCities(currentRegion): boolean {
    this.cities = currentRegion.map((element) =>
      element.locationsDto.map((item) =>
        item.locationTranslationDtoList.filter((it) => it.languageCode === 'ua').map((it) => it.locationName)
      )
    );
    this.cities = this.cities.reduce((acc, val) => acc.concat(val), []).reduce((acc, val) => acc.concat(val), []);
    this.filteredCities = this.city.valueChanges.pipe(
      startWith(''),
      map((value: string) => (value ? this._filter(value, this.cities) : this.cities.slice()))
    );
    return this.cities.length !== 0 ? true : false;
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
        headerText: 'addTemplate'
      }
    });
  }

  openEditLocation(): void {
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        headerText: 'editTemplate'
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

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
