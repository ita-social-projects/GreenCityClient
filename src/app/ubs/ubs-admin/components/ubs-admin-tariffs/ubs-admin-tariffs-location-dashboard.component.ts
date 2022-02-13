import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TariffsService } from '../../services/tariffs.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Locations } from '../../models/tariffs.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up/ubs-admin-tariffs-location-pop-up.component';
import { UbsAdminTariffsAddNamePopUpComponent } from './ubs-admin-tariffs-add-name-pop-up/ubs-admin-tariffs-add-name-pop-up.component';
import { Store } from '@ngrx/store';
import { MatChipInputEvent } from '@angular/material/chips';

import { IAppState } from 'src/app/store/state/app.state';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-ubs-admin-tariffs-location-dashboard',
  templateUrl: './ubs-admin-tariffs-location-dashboard.component.html',
  styleUrls: ['./ubs-admin-tariffs-location-dashboard.component.scss']
})
export class UbsAdminTariffsLocationDashboardComponent implements OnInit, OnDestroy {
  @Input() showTitle = true;
  @Input() locationCard: Locations;
  @Input() textBack: TemplateRef<any>;

  locations;
  selectedLocationId;
  couriers;
  currentLanguage;
  reset = true;
  checkedCities = [];
  pattern = /^[А-Яа-яїЇіІєЄёЁ.\'\-\ ]*/;

  searchForm = this.fb.group({
    region: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.pattern)]],
    city: ['', [Validators.required, Validators.maxLength(40)]],
    courier: ['', [Validators.required]],
    station: ['', [Validators.required]],
    state: ['all']
  });

  public regions = ['Київська область', 'Львівська область'];
  public cities = ['Київ', 'Ірпінь', 'Бориспіль', 'Львів', 'Наварія'];

  public stations = ['Слобідська', 'Неслобідська'];
  public newCouriers = ["УБС-кур'єр", 'Уклон'];

  allSelected = false;
  filteredRegions;
  filteredCities;
  filteredLocations;
  private destroy: Subject<boolean> = new Subject<boolean>();

  mainUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=';
  public icons = {
    setting: './assets/img/ubs-tariff/setting.svg',
    crumbs: './assets/img/ubs-tariff/crumbs.svg',
    restore: './assets/img/ubs-tariff/restore.svg',
    arrowDown: './assets/img/ubs-tariff/arrow-down.svg',
    arrowRight: './assets/img/ubs-tariff/arrow-right.svg'
  };
  locations$ = this.store.select((state: IAppState): Locations => state.locations.locations);

  constructor(
    private tariffsService: TariffsService,
    private router: Router,
    public dialog: MatDialog,
    private localeStorageService: LocalStorageService,
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
    this.getLocations();
    this.getCouriers();
    this.loadScript();
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
    this.initFilter();
  }

  initFilter() {
    this.filteredRegions = this.region.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.regions))
    );
    this.filteredCities = this.city.valueChanges.pipe(
      startWith(''),
      map((value: string) => (value ? this._filter(value, this.cities) : this.cities.slice()))
    );
  }

  private _filter(name: string, items) {
    const filterValue = name.toLowerCase();
    return items.filter((option) => option.toLowerCase().includes(filterValue));
  }

  addItem(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.checkedCities.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  selected(event: MatAutocompleteSelectedEvent, trigger): void {
    if (event.option.value === 'all') {
      this.toggleSelectAll();
    } else {
      this.selectCity(event);
    }
    this.positionsFilter();
    this.city.setValue('');
    requestAnimationFrame(() => {
      trigger.openPanel();
    });
  }

  selectCity(event) {
    const newValue = event.option.viewValue;
    if (this.checkedCities.includes(newValue)) {
      this.checkedCities = [...this.checkedCities.filter((item) => item !== newValue)];
    } else {
      this.checkedCities.push(event.option.viewValue);
    }
  }

  isChecked() {
    return this.checkedCities.length === this.cities.length;
  }

  isEmpty() {
    return this.filteredLocations.length === 0;
  }

  positionsFilter() {
    if (this.checkedCities.length !== 0) {
      this.filteredLocations = this.onPositionSelected();
    } else {
      this.filteredLocations = this.locations;
    }
  }

  onPositionSelected() {
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

  openAuto(event, trigger: MatAutocompleteTrigger) {
    event.stopPropagation();
    trigger.openPanel();
  }

  toggleSelectAll() {
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
      script.src = this.mainUrl + this.currentLanguage;
    } else {
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.setAttribute('src', this.mainUrl + this.currentLanguage);
      document.getElementsByTagName('head')[0].appendChild(google);
    }
  }

  getLocations() {
    this.store.dispatch(GetLocations({ reset: this.reset }));

    this.locations$.subscribe((item) => {
      if (item) {
        const key = 'content';
        this.locations = Array.from(Object.values(item[key]));
        this.filteredLocations = this.locations;
        this.reset = false;
      }
    });
  }

  page(locationID) {
    this.router.navigate([`ubs-admin/tariffs/location/${locationID}`]);
  }

  getCouriers() {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res;
      });
  }

  activateLocation(location) {
    const id = location.id;
    const languageCode = 'ua';
    this.tariffsService
      .activateLocation(id, languageCode)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getLocations());
  }

  deactivateLocation(location) {
    const id = location.id;
    const languageCode = 'ua';
    this.tariffsService
      .deactivateLocation(id, languageCode)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getLocations());
  }

  openAddCourierDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'addCourier'
    };
    this.dialog.open(UbsAdminTariffsAddNamePopUpComponent, dialogConfig);
  }

  openAddStationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'addStation'
    };
    this.dialog.open(UbsAdminTariffsAddNamePopUpComponent, dialogConfig);
  }

  openAddLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'addTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  openEditLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'editTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  openDeactivateLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'deactivateTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
