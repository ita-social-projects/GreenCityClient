import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LanguageModel } from '@eco-news-models/create-news-interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { select, Store } from '@ngrx/store';
import { columnsToFilterByName } from '@ubs/ubs-admin/models/columns-to-filter-by-name';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filtersSelector, locationsDetailsSelector } from 'src/app/store/selectors/big-order-table.selectors';
import {
  ICityDetails,
  IDistrictDetails,
  IFilteredColumnValue,
  IFilters,
  ILocationBase,
  ILocationDetails
} from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';

@Component({
  selector: 'app-column-filters-pop-up',
  templateUrl: './column-filters-pop-up.component.html',
  styleUrls: ['./column-filters-pop-up.component.scss']
})
export class ColumnFiltersPopUpComponent implements OnInit, OnDestroy {
  @ViewChild('picker1') pickerFrom: MatDatepicker<Date>;
  @ViewChild('picker2') pickerTo: MatDatepicker<Date>;

  dateFrom: Date;
  dateTo: Date;
  dateChecked: boolean;
  isLocationColumn: boolean;
  optionsForFiltering: IFilteredColumnValue[] = [];
  displayedOptionsForFiltering: IFilteredColumnValue[] = [];

  locationDetails: ILocationDetails[] = [];
  allLocations: ILocationBase[] = [];

  searchTerm = '';
  isPopupOpened = false;
  showButtons = false;
  selectedFiltersCount = 0;

  private allFilters: IFilters;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<ColumnFiltersPopUpComponent>,
    private elementRef: ElementRef,
    private adapter: DateAdapter<LanguageModel>,
    private adminTableService: AdminTableService,
    private store: Store,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      const locale = lang !== 'ua' ? 'en-GB' : 'uk-UA';
      this.adapter.setLocale(locale);
    });
    this.setPopupPosUnderButton();
    this.initListeners();
    this.showButtons = false;

    this.isLocationColumn = columnsToFilterByName.includes(this.data.columnName);
    this.isLocationColumn ? this.getLocationsForFiltering() : this.getOptionsForFiltering();
  }

  initListeners(): void {
    this.store.pipe(takeUntil(this.destroy$), select(filtersSelector)).subscribe((filters: IFilters) => {
      this.allFilters = filters;
      this.adminTableService.setCurrentFilters(this.allFilters);

      const filtersDateCheck = filters?.[this.data.columnName + 'Check'];
      if (typeof filtersDateCheck === 'boolean') {
        this.dateChecked = filtersDateCheck;
      }

      const filtersDateFrom = filters?.[this.data.columnName + 'From'];
      if (filtersDateFrom && typeof filtersDateFrom === 'string') {
        this.dateFrom = new Date(filtersDateFrom);
      }

      const filtersDateTo = filters?.[this.data.columnName + 'To'];
      if (filtersDateTo && typeof filtersDateTo === 'string') {
        this.dateTo = new Date(filtersDateTo);
      }
    });
  }

  getLocationsForFiltering(): void {
    this.store.pipe(select(locationsDetailsSelector), takeUntil(this.destroy$)).subscribe((locations) => {
      this.locationDetails = locations;

      if (this.data.columnName === 'region') {
        this.allLocations = this.locationDetails;
      } else if (this.data.columnName === 'city') {
        this.allLocations = this.getCitiesForFiltering();
      } else if (this.data.columnName === 'district') {
        this.allLocations = this.getDistrictsForFiltering();
      }

      this.optionsForFiltering = this.allLocations.map(this.toFilteredColumnValue);
      this.displayedOptionsForFiltering = this.optionsForFiltering.slice(0, 100);
    });
  }

  getCitiesForFiltering(): ICityDetails[] {
    const regionIds = this.allFilters.region && Array.isArray(this.allFilters.region) ? this.getRegionIds(this.allFilters.region) : [];
    const cities = this.locationDetails.map((region) => region.cities).flat();

    return regionIds.length ? cities.filter((city) => regionIds.includes(city.regionId)) : cities;
  }

  getDistrictsForFiltering(): IDistrictDetails[] {
    const cityIds = this.allFilters.city && Array.isArray(this.allFilters.city) ? this.getCityIds(this.allFilters.city) : [];
    const districts = this.getCitiesForFiltering()
      .map((city) => city.districts)
      .flat();

    return cityIds.length ? districts.filter((district) => cityIds.includes(district.cityId)) : districts;
  }

  onSearchTermChange(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.displayedOptionsForFiltering = this.optionsForFiltering
      .filter((option) => option.ua.toLowerCase().includes(term) || option.en.toLowerCase().includes(term))
      .slice(0, 100);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any): void {
    const clickedInside = this.matDialogRef.componentInstance.elementRef.nativeElement.contains(event.target);
    const isCalendarOpened = this.pickerFrom?.opened || this.pickerTo?.opened;

    if (!clickedInside && this.isPopupOpened && !isCalendarOpened) {
      this.discardChanges();
      this.matDialogRef.close();
    }

    if (!this.isPopupOpened) {
      this.isPopupOpened = true;
    }
  }

  onFilterChange(checked: boolean, currentColumn: string, option: IFilteredColumnValue): void {
    this.showButtons = true;
    this.adminTableService.setNewFilters(checked, currentColumn, option);
  }

  onDateChecked(e: MatCheckboxChange, checked: boolean): void {
    this.onDateChange();
    this.adminTableService.setNewDateChecked(this.data.columnName, checked);
  }

  onDateChange(): void {
    this.showButtons = true;
    const swappedDates = this.adminTableService.swapDatesIfNeeded(this.dateFrom, this.dateTo, this.dateChecked);

    this.dateFrom = swappedDates ? swappedDates.dateFrom : this.dateFrom;
    this.dateTo = swappedDates ? swappedDates.dateTo : this.dateTo;

    const formattedDateFrom = this.dateFrom ? this.adminTableService.setDateFormat(this.dateFrom) : '';
    const formattedDateTo = this.dateTo ? this.adminTableService.setDateFormat(this.dateTo) : '';

    this.adminTableService.setNewDateRange(this.data.columnName, formattedDateFrom, formattedDateTo);
  }

  isChecked(columnName: string, option: IFilteredColumnValue): boolean {
    return this.adminTableService.isFilterChecked(columnName, option);
  }

  discardChanges(): void {
    this.adminTableService.setCurrentFilters(this.allFilters);

    const dateFromFilter = this.allFilters[this.data.columnName + 'From'];
    const dateToFilter = this.allFilters[this.data.columnName + 'To'];

    this.dateFrom = dateFromFilter ? new Date(dateFromFilter as string) : null;
    this.dateTo = dateToFilter ? new Date(dateToFilter as string) : null;
  }

  discardDateChanges(type: 'from' | 'to', event: Event): void {
    event.stopPropagation();
    if (type === 'from') {
      this.dateFrom = null;
    } else if (type === 'to') {
      this.dateTo = null;
    }

    this.onDateChange();
  }

  getOptionsForFiltering(): void {
    this.optionsForFiltering = this.adminTableService.columnsForFiltering.find((column) => column.key === this.data.columnName).values;
    this.displayedOptionsForFiltering = this.optionsForFiltering;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setPopupPosUnderButton(): void {
    const rect = this.data.trigger.nativeElement.getBoundingClientRect();
    const position = { left: `${rect.left}px`, top: `${rect.top + rect.height}px` };

    if (rect.left + this.data.width > document.body.clientWidth) {
      position.left = `${rect.left + rect.width - this.data.width}px`;
    }
    this.matDialogRef.updatePosition(position);
    this.matDialogRef.updateSize(`${this.data.width}px`, `${this.data.height}px`);
  }

  //Temporary solution, need to refactor after back-end is ready to filter locations by id
  private getRegionIds(names: string[]): number[] {
    return this.locationDetails.filter((location) => names.includes(location.nameEn)).map((location) => location.id);
  }

  //Temporary solution, need to refactor after back-end is ready to filter locations by id
  private getCityIds(names: string[]): number[] {
    return this.locationDetails
      .map((location) => location.cities)
      .flat()
      .filter((city) => names.includes(city.nameEn))
      .map((city) => city.id);
  }

  private toFilteredColumnValue(location: ILocationBase): IFilteredColumnValue {
    return {
      key: location.id.toString(),
      ua: location.nameUk,
      en: location.nameEn
    };
  }
}
