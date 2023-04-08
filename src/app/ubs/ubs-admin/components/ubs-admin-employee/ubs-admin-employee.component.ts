import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsAdminEmployeeEditFormComponent } from './ubs-admin-employee-edit-form/ubs-admin-employee-edit-form.component';
import { UbsAdminEmployeeService } from '../../services/ubs-admin-employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';
import { Observable, Subject } from 'rxjs';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { Couriers, CreateCard, Locations } from '../../models/tariffs.interface';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { TariffsService } from '../../services/tariffs.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';
import { EmployeePositions, Employees, Page } from '../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-employee',
  templateUrl: './ubs-admin-employee.component.html',
  styleUrls: ['./ubs-admin-employee.component.scss']
})
export class UbsAdminEmployeeComponent implements OnInit {
  @Input() locationCard: Locations;

  employeePositions: EmployeePositions[];
  locations: Locations[];
  regionEnglishName: string[];
  regionNameUk: string;
  regionId: number;
  showAllEmployees = true;
  positionsPlaceholder: string;
  cityPlaceholder: string;
  courierPlaceholder: string;
  regionPlaceholder: string;
  reset = true;
  cities = [];
  regions = [];
  filteredRegions;
  filteredCities;
  couriers: Couriers[];
  couriersName: Array<string>;
  positionName: Array<string>;
  courierNameEng: string;
  courierNameUk: string;
  courierId;
  cards = [];
  cardsUk = [];
  cardsEn = [];
  filterData = { status: '' };
  createCardObj: CreateCard;
  isFieldFilled = false;
  isCardExist = false;
  currentLang;
  tagList: TagInterface[];
  publictags: Observable<Array<TagInterface>>;
  selectedTagsList: Array<string> = [];
  isElementFocused = false;
  selectedCities = [];
  selectedCouriers = [];
  selectedPositions = [];
  selectedRegions = [];
  selectedContact = [];
  employees$ = this.store.select((state: IAppState): Employees => state.employees.employees);
  employeePhoneNumbers = [];
  employeeEmails = [];
  employeesContacts = [];

  public icons = {
    setting: './assets/img/ubs-tariff/setting.svg',
    crumbs: './assets/img/ubs-tariff/crumbs.svg',
    restore: './assets/img/ubs-tariff/restore.svg',
    arrowDown: './assets/img/ubs-tariff/arrow-down.svg',
    arrowRight: './assets/img/ubs-tariff/arrow-right.svg'
  };

  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);

  searchForm: FormGroup;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    private ubsAdminEmployeeService: UbsAdminEmployeeService,
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    this.localeStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.setCard();
    });
    this.initForm();
    this.getPositions();
    this.getContacts();
    this.getLocations();
    this.getCouriers();
    this.region.valueChanges.pipe(takeUntil(this.destroy)).subscribe((value) => {
      this.regionSelectedSub(value);
      this.checkRegionValue();
      this.selectedCities = [];
      this.selectedCouriers = [];
    });
    this.setCountOfCheckedCity();
    this.setCountOfCheckedPositions();
    this.setCountOfCheckedCouriers();
    this.setCountOfCheckedRegions();
    this.languageService
      .getCurrentLangObs()
      .pipe(takeUntil(this.destroy))
      .subscribe((i) => {
        this.getLocations();
        this.translateSelectedCity();
        this.setCountOfCheckedCity();
        this.setCountOfCheckedPositions();
        this.setCountOfCheckedCouriers();
        this.setCountOfCheckedRegions();
        this.getCouriers();
      });
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      position: ['', [Validators.required]],
      contacts: ['', [Validators.required]],
      region: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]],
      city: ['', [Validators.required, Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]],
      courier: ['', [Validators.required]]
    });
  }

  private setCard(): void {
    this.cards = this.languageService.getLangValue(this.cardsUk, this.cardsEn) as any[];
  }

  get position() {
    return this.searchForm.get('position');
  }
  get contacts() {
    return this.searchForm.get('contacts');
  }
  get region() {
    return this.searchForm.get('region');
  }
  get city() {
    return this.searchForm.get('city');
  }
  get courier() {
    return this.searchForm.get('courier');
  }

  getPositions(): void {
    this.ubsAdminEmployeeService.getAllPositions().subscribe(
      (roles) => {
        this.employeePositions = roles;
        this.positionName = this.employeePositions.map((el) => el.name);
      },
      (error) => console.error('Observer for role got an error: ' + error)
    );
  }

  getContacts(): void {
    this.employees$.subscribe((item: Employees) => {
      if (item) {
        this.employeePhoneNumbers = item[`content`].map((employee: Page) => employee.phoneNumber);
        this.employeeEmails = item[`content`].map((employee: Page) => employee.email);
        this.employeesContacts = [...this.employeePhoneNumbers, ...this.employeeEmails];
      }
    });
  }

  getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));
    this.locations$.pipe(skip(1)).subscribe((item: Locations[]) => {
      if (item) {
        this.locations = item;
        const regions = this.locations
          .map((element) => {
            return element.regionTranslationDtos.filter((it) => it.languageCode === this.currentLang).map((it) => it.regionName);
          })
          .flat(2);
        this.filteredRegions = regions;
        console.log('this.filteredRegions', this.filteredRegions);
        this.cities = this.mapCities(this.locations);
        this.filteredCities = this.filterOptions(
          this.city,
          this.cities.map((elem) => elem.name)
        );
        this.reset = false;
      }
    });
  }

  filterOptions(control, array): Array<string> {
    return control.valueChanges.pipe(
      startWith(''),
      map((value: string) => (value ? this._filter(value, array) : array.slice()))
    );
  }

  public _filter(name: string, items: any[]): any[] {
    const filterValue = name.toLowerCase();
    return items.filter((option) => option.toLowerCase().includes(filterValue));
  }

  public mapCities(region: Locations[]): Array<object> {
    const cityArray = [];
    region.forEach((element) =>
      element.locationsDto.forEach((el) => {
        const tempItem = {
          name: el.locationTranslationDtoList
            .filter((it) => it.languageCode === this.currentLang)
            .map((it) => it.locationName)
            .join(),
          id: el.locationId,
          locationTranslationDtoList: el.locationTranslationDtoList
        };
        cityArray.push(tempItem);
      })
    );
    return cityArray;
  }

  translateSelectedCity() {
    this.selectedCities.forEach((city) => {
      city.name = this.getLangValue(city.ukrainianName, city.englishName);
    });
  }

  private getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Couriers[]) => {
        this.couriers = res;
        this.couriersName = this.couriers.map((el) => this.getLangValue(el.nameUk, el.nameEn));
      });
  }

  public setCountOfCheckedCity(): void {
    if (this.selectedCities.length) {
      this.translate.get('ubs-tariffs.selected').subscribe((data) => (this.cityPlaceholder = `${this.selectedCities.length} ${data}`));
    } else {
      this.translate.get('employees.city').subscribe((data) => (this.cityPlaceholder = data));
    }
  }

  public setCountOfCheckedPositions(): void {
    if (this.selectedPositions.length) {
      this.translate
        .get('ubs-tariffs.selected')
        .subscribe((data) => (this.positionsPlaceholder = `${this.selectedPositions.length} ${data}`));
    } else {
      this.translate.get('employees.position').subscribe((data) => (this.positionsPlaceholder = data));
    }
  }

  public setCountOfCheckedRegions(): void {
    if (this.selectedRegions.length) {
      this.translate.get('ubs-tariffs.selected').subscribe((data) => (this.regionPlaceholder = `${this.selectedRegions.length} ${data}`));
    } else {
      this.translate.get('employees.region').subscribe((data) => (this.regionPlaceholder = data));
    }
  }

  public setCountOfCheckedCouriers(): void {
    if (this.selectedCouriers.length) {
      this.translate.get('ubs-tariffs.selected').subscribe((data) => (this.courierPlaceholder = `${this.selectedCouriers.length} ${data}`));
    } else {
      this.translate.get('employees.courier').subscribe((data) => (this.courierPlaceholder = data));
    }
  }

  get getEnableResetAll(): boolean {
    return (
      !!this.selectedPositions.length ||
      !!this.selectedContact.length ||
      !!this.selectedRegions.length ||
      !!this.selectedCities.length ||
      !!this.selectedCouriers.length
    );
  }

  checkRegionValue(): void {
    let currentRegion;
    if (this.selectedRegions.length === 0) {
      currentRegion = this.locations;
    } else {
      currentRegion = this.selectedRegions;
    }

    this.cities = this.mapCities(currentRegion);
    this.filteredCities = this.filterOptions(
      this.city,
      this.cities.map((elem) => elem.name)
    );
  }

  public onSelectPosition(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    if (event.option.value === 'all') {
      this.toggleSelectAllPositions();
      const positionsId = this.employeePositions.map((position) => position.id);
      Object.assign(this.filterData, { position: positionsId });
    } else {
      this.selectPosition(event);
      const positionId = this.selectedPositions.map((it) => it.id);
      Object.assign(this.filterData, { position: positionId });
    }
    this.position.setValue('');
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
  }

  public onSelectCourier(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    if (event.option.value === 'all') {
      this.toggleSelectAllCourier();
      const couriersId = this.couriers.map((courier) => courier.courierId);
      Object.assign(this.filterData, { courier: couriersId });
    } else {
      this.selectCourier(event);
      const courierId = this.selectedCouriers.map((it) => it.id);
      Object.assign(this.filterData, { courier: courierId });
    }
    this.courier.setValue('');
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
  }

  toggleSelectAllPositions(): void {
    if (!this.isPositionChecked()) {
      this.selectedPositions.length = 0;
      this.employeePositions.forEach((position) => {
        const tempItem = this.transformPositionToSelectedPosition(position);
        this.selectedPositions.push(tempItem);
        this.setCountOfCheckedPositions();
      });
    } else {
      this.selectedPositions.length = 0;
      this.setCountOfCheckedPositions();
    }
  }

  toggleSelectAllRegion(): void {
    if (!this.isRegionChecked()) {
      this.selectedRegions.length = 0;
      this.selectedRegions = [...this.locations];
    } else {
      this.selectedRegions.length = 0;
    }
    this.setCountOfCheckedRegions();
  }

  toggleSelectAllCity(): void {
    if (!this.isCityChecked()) {
      this.selectedCities.length = 0;
      this.cities.forEach((city) => {
        const tempItem = this.transformCityToSelectedCity(city);
        this.selectedCities.push(tempItem);
      });
    } else {
      this.selectedCities.length = 0;
    }
  }

  toggleSelectAllCourier(): void {
    if (!this.isCourierChecked()) {
      this.selectedCouriers.length = 0;
      this.couriers.forEach((courier) => {
        const tempItem = this.transformCourierToSelectedCourier(courier);
        this.selectedCouriers.push(tempItem);
      });
    } else {
      this.selectedCouriers.length = 0;
    }
    this.setCountOfCheckedCouriers();
  }

  transformPositionToSelectedPosition(position: any) {
    return {
      name: position.name,
      id: position.id
    };
  }

  transformRegionToSelectedRegion(region: any) {
    const selectedRegionName = this.getSelectedCityName(region, 'ua');
    const selectedRegionEnglishName = this.getSelectedCityName(region, 'en');
    return {
      name: this.getLangValue(selectedRegionName, selectedRegionEnglishName),
      id: region.id,
      englishName: selectedRegionEnglishName,
      ukrainianName: selectedRegionName
    };
  }

  transformCityToSelectedCity(city: any) {
    const selectedCityName = this.getSelectedCityName(city, 'ua');
    const selectedCityEnglishName = this.getSelectedCityName(city, 'en');
    return {
      name: this.getLangValue(selectedCityName, selectedCityEnglishName),
      id: city.id,
      englishName: selectedCityEnglishName,
      ukrainianName: selectedCityName
    };
  }

  transformCourierToSelectedCourier(courier: any) {
    return {
      name: this.getLangValue(courier.nameUk, courier.nameEn),
      id: courier.courierId,
      englishName: courier.nameEn,
      ukrainianName: courier.nameUk
    };
  }

  isPositionChecked(): boolean {
    return this.selectedPositions.length === this.employeePositions?.length;
  }

  isRegionChecked(): boolean {
    return this.selectedRegions.length === this.filteredRegions?.length;
  }

  isCityChecked(): boolean {
    return this.selectedCities.length === this.cities.length;
  }

  isCourierChecked(): boolean {
    return this.selectedCouriers.length === this.couriers?.length;
  }

  getSelectedCityName(city: any, languageCode: string) {
    return city.locationTranslationDtoList
      .filter((it) => it.languageCode === languageCode)
      .map((it) => it.locationName)
      .join();
  }

  getSelectedRegionName(location: any, languageCode: string) {
    return location.regionTranslationDtos
      .filter((it) => it.languageCode === languageCode)
      .map((it) => it.regionName)
      .join();
  }

  public resetRegionValue(): void {
    this.region.setValue('');
    this.selectedCities = [];
    this.setCountOfCheckedCity();
    const locationsId = this.locations.map((location) => location.locationsDto.map((elem) => elem.locationId)).flat(2);
    Object.assign(this.filterData, { region: '', location: locationsId });
  }

  public onSelectCity(event: MatAutocompleteSelectedEvent, trigger?: MatAutocompleteTrigger): void {
    if (event.option.value === 'all') {
      this.toggleSelectAllCity();
      const locationsId = this.locations.map((location) => location.locationsDto.map((elem) => elem.locationId)).flat(2);
      Object.assign(this.filterData, { location: locationsId });
    } else {
      this.selectCitsy(event);
      const locationId = this.selectedCities.map((it) => it.id);
      Object.assign(this.filterData, { location: locationId });
    }
    this.setCountOfCheckedCity();
    this.city.setValue('');
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
  }

  selectPosition(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = this.employeePositions.find((ob) => {
      return ob.name === event.option.viewValue;
    });

    const positionName = selectedValue.name;
    const positionId = selectedValue.id;

    const tempItem = {
      name: positionName,
      id: positionId
    };
    const newValue = event.option.viewValue;
    if (this.selectedPositions.map((it) => it.name).includes(newValue)) {
      this.selectedPositions = this.selectedPositions.filter((item) => item.name !== newValue);
    } else {
      this.selectedPositions.push(tempItem);
    }
    this.setCountOfCheckedPositions();
  }

  selectCitsy(event: MatAutocompleteSelectedEvent): void {
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
    const selectedCityEnglishName = selectedCity.locationTranslationDtoList
      .filter((it) => it.languageCode === 'en')
      .map((it) => it.locationName)
      .join();
    const tempItem = {
      name: this.getLangValue(selectedCityName, selectedCityEnglishName),
      id: selectedCityId,
      englishName: selectedCityEnglishName,
      ukrainianName: selectedCityName
    };
    const newValue = event.option.viewValue;
    if (this.selectedCities.map((it) => it.name).includes(newValue)) {
      this.selectedCities = this.selectedCities.filter((item) => item.name !== newValue);
    } else {
      this.selectedCities.push(tempItem);
    }
  }

  selectCourier(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = this.couriers.find((ob) => {
      const searchingFilter = this.getLangValue(ob.nameUk, ob.nameEn);
      return searchingFilter === event.option.viewValue;
    });
    this.courierNameUk = selectedValue.nameUk;
    this.courierNameEng = selectedValue.nameEn;
    this.courierId = selectedValue.courierId;

    const tempItem = {
      name: this.getLangValue(this.courierNameUk, this.courierNameEng),
      id: this.courierId,
      englishName: this.courierNameEng,
      ukrainianName: this.courierNameUk
    };
    const newValue = event.option.viewValue;
    if (this.selectedCouriers.map((it) => it.name).includes(newValue)) {
      this.selectedCouriers = this.selectedCouriers.filter((item) => item.name !== newValue);
    } else {
      this.selectedCouriers.push(tempItem);
    }
    this.setCountOfCheckedCouriers();
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  checkSelectedItem(item: string, array: Array<{ name: string; id: number }>): boolean {
    return array.map((it) => it.name).includes(item);
  }

  checkSelectedItemRegion(name: string): boolean {
    return this.selectedRegions.some((it) => it.regionTranslationDtos.some((ob) => ob.regionName === name));
  }

  contactSelected(event): void {
    this.selectedContact = this.employeesContacts.filter((contact) => contact === event.option.value.toString());
    Object.assign(this.filterData, { contact: this.selectedContact });
  }

  regionSelectedSub(value) {
    if (value === 'all') {
      this.toggleSelectAllRegion();
      Object.assign(this.filterData, { region: '' });
    } else if (value == null) {
      this.selectedRegions.length = 0;
      Object.assign(this.filterData, { region: '' });
    } else {
      const newValue = value;

      const selectedValue = this.locations.filter((it) => it.regionTranslationDtos.find((ob) => ob.regionName === newValue));
      this.regionEnglishName = selectedValue
        .map((it) => it.regionTranslationDtos.filter((ob) => ob.languageCode === 'en').map((i) => i.regionName))
        .flat(2);
      this.regionId = selectedValue.find((it) => it.regionId).regionId;

      if (this.selectedRegions.some((it) => it.regionId === this.regionId)) {
        this.selectedRegions = this.selectedRegions.filter((item) => item.regionId !== this.regionId);
      } else {
        this.selectedRegions.push(selectedValue.find((it) => it.regionId === this.regionId));
      }
      Object.assign(this.filterData, { region: this.regionId });
    }
    this.setCountOfCheckedRegions();
  }

  getRegionName(region: Locations): string {
    const selectedRegionName = this.getSelectedRegionName(region, 'ua');
    const selectedRegionEnglishName = this.getSelectedRegionName(region, 'en');
    return this.getLangValue(selectedRegionName, selectedRegionEnglishName);
  }

  addItem(event: MatChipInputEvent, option: string): void {
    const value = event.value;

    if ((value || '').trim()) {
      if (option === 'city') {
        this.selectedCities.push(value.trim());
      } else if (option === 'courier') {
        this.selectedCouriers.push(value.trim());
      } else if (option === 'position') {
        this.selectedPositions.push(value.trim());
      } else if (option === 'region') {
        this.selectedRegions.push(value.trim());
      }
    }
  }

  addRegion(value): void {
    this.selectedRegions.push(value);
  }

  getFilterData(tags: Array<string>): void {
    if (this.tagList.length) {
      this.selectedTagsList = tags;
    }
  }

  resetAllFilters(): void {
    this.searchForm.reset();

    this.selectedCouriers.length = 0;
    this.setCountOfCheckedCouriers();

    this.selectedPositions.length = 0;
    this.setCountOfCheckedPositions();

    this.selectedCities.length = 0;
    this.setCountOfCheckedCity();

    this.selectedRegions.length = 0;
    this.setCountOfCheckedRegions();

    this.selectedContact.length = 0;
  }

  removeItem(filterName: any, selectorType: string): void {
    switch (selectorType) {
      case 'position':
        this.selectedPositions = this.selectedPositions.filter((item) => item.id !== filterName.id);
        this.setCountOfCheckedPositions();
        break;
      case 'contact':
        this.selectedContact = this.selectedContact.filter((item) => item !== filterName);
        this.contacts.setValue('');
        break;
      case 'city':
        this.selectedCities = this.selectedCities.filter((item) => item.id !== filterName.id);
        this.setCountOfCheckedCity();
        break;
      case 'courier':
        this.selectedCouriers = this.selectedCouriers.filter((item) => item.id !== filterName.id);
        this.setCountOfCheckedCouriers();
        break;
      case 'region':
        this.selectedRegions = this.selectedRegions.filter((item) => item.regionId !== filterName.regionId);
        this.setCountOfCheckedRegions();
        this.checkRegionValue();
        break;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ubsAdminEmployeeService.searchValue.next(filterValue.trim().toLowerCase());
  }

  openDialog() {
    this.dialog.open(UbsAdminEmployeeEditFormComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'admin-cabinet-dialog-container'
    });
  }
}
