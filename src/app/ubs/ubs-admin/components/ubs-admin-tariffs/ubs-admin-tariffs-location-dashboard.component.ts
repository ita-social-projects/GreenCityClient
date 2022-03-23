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

  locations = [];
  selectedLocationId;
  couriers;
  currentLanguage;
  reset = true;
  checkedCities = [];
  pattern = /^[А-Яа-яїЇіІєЄёЁ.\'\-\ ]*/;

  searchForm;
  regions = [];
  cities = [];
  public stations = ['Слобідська', 'Неслобідська'];
  public newCouriers = ['УБС-курєр', 'Уклон'];

  allSelected = false;
  filteredRegions;
  filteredCities;
  filteredLocations = [];
  private destroy: Subject<boolean> = new Subject<boolean>();

  mainUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=';
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
    this.initForm();
    this.getLocations();
    this.getCouriers();
    this.loadScript();
    this.city.disable();
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
    this.region.valueChanges.subscribe((value) => {
      this.checkRegionValue(value);
      this.checkedCities = [];
      this.positionsFilter();
    });
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      region: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.pattern)]],
      city: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(40)]],
      courier: ['', [Validators.required]],
      station: ['', [Validators.required]],
      state: ['all']
    });
  }

  initFilter(): void {
    this.filteredRegions = this.region.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value, this.regions))
    );
    this.filteredCities = this.city.valueChanges.pipe(
      startWith(''),
      map((value: string) => (value ? this._filter(value, this.cities) : this.cities.slice()))
    );
  }

  private _filter(name: string, items: any[]): any[] {
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

  selected(event: MatAutocompleteSelectedEvent, trigger: MatAutocompleteTrigger): void {
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
      script.src = this.mainUrl + this.currentLanguage;
    } else {
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.setAttribute('src', this.mainUrl + this.currentLanguage);
      document.getElementsByTagName('head')[0].appendChild(google);
    }
  }

  getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));

    this.locations$.pipe(takeUntil(this.destroy)).subscribe((item) => {
      if (item) {
        const key = 'content';
        this.locations = item[key];
        if (this.locations) {
          this.filteredLocations = this.locations;
          this.regions = [].concat(
            ...this.locations.map((it) => it.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName))
          );
        }
        console.log('item', item[`content`]);
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
        this.couriers = res;
      });
  }

  checkRegionValue(value): void {
    const currentRegion = this.locations.filter((it) => it.regionTranslationDtos.find((it) => it.regionName === value));
    console.log(this.selectCities(currentRegion));
    if (value && this.selectCities(currentRegion)) {
      this.city.enable();
    } else {
      this.city.disable();
    }
  }

  selectCities(currentRegion): boolean {
    this.cities = currentRegion.map((it) =>
      it.locationsDto.map((it) => it.locationTranslationDtoList.filter((it) => it.languageCode === 'ua').map((it) => it.locationName))
    );
    this.cities = this.cities.reduce((acc, val) => acc.concat(val), []).reduce((acc, val) => acc.concat(val), []);
    console.log(this.cities);
    this.filteredCities = this.city.valueChanges.pipe(
      startWith(''),
      map((value: string) => (value ? this._filter(value, this.cities) : this.cities.slice()))
    );
    return this.cities.length != 0 ? true : false;
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

  openAddLocation(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'addTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  openEditLocation(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'editTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  openDeactivateLocation(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-w-100';
    dialogConfig.data = {
      headerText: 'deactivateTemplate'
    };
    this.dialog.open(UbsAdminTariffsLocationPopUpComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
