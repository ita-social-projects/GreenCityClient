import { MatCheckboxChange } from '@angular/material/checkbox';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { Component, ElementRef, HostListener, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilteredColumn, IFilteredColumnValue, IFilters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { DateAdapter } from '@angular/material/core';
import { take, takeUntil } from 'rxjs/operators';
import { iif, Subject } from 'rxjs';
import { LanguageModel } from '@eco-news-models/create-news-interface';
import { MatDatepicker } from '@angular/material/datepicker';
import { select, Store } from '@ngrx/store';
import moment from 'moment';
import { filtersSelector } from 'src/app/store/selectors/big-order-table.selectors';
import { AddFilterMultiAction, AddFiltersAction, RemoveFilter } from 'src/app/store/actions/bigOrderTable.actions';
import { columnsToFilterByName } from '@ubs/ubs-admin/models/columns-to-filter-by-name';

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
  filteredValues: IFilteredColumnValue[] = [];

  isPopupOpened = false;

  private allFilters: IFilters;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<ColumnFiltersPopUpComponent>,
    private elementRef: ElementRef,
    private adapter: DateAdapter<LanguageModel>,
    private injector: Injector,
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

    this.getOptionsForFiltering();
  }

  initListeners(): void {
    this.store.pipe(takeUntil(this.destroy$), select(filtersSelector)).subscribe((filters: IFilters) => {
      this.allFilters = filters;

      const filtersDateCheck = filters?.[this.data.columnName + 'Check'];
      if (filtersDateCheck !== null && filtersDateCheck !== undefined && typeof filtersDateCheck === 'boolean') {
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

  @HostListener('document:click', ['$event'])
  onClick(event: any): void {
    const clickedInside = this.matDialogRef.componentInstance.elementRef.nativeElement.contains(event.target);
    const isCalendarOpened = this.pickerFrom?.opened || this.pickerTo?.opened;

    if (!clickedInside && this.isPopupOpened && !isCalendarOpened) {
      this.matDialogRef.close();
    }

    if (!this.isPopupOpened) {
      this.isPopupOpened = true;
    }
  }

  changeColumnFilters(checked: boolean, currentColumn: string, option: IFilteredColumnValue): void {
    const value = columnsToFilterByName.includes(currentColumn) ? option.en : option.key;
    checked
      ? this.store.dispatch(AddFilterMultiAction({ filter: { column: currentColumn, value }, fetchTable: false }))
      : this.store.dispatch(RemoveFilter({ filter: { column: currentColumn, value }, fetchTable: false }));
  }

  onDateChecked(e: MatCheckboxChange, checked: boolean): void {
    this.store.dispatch(AddFiltersAction({ filters: { [this.data.columnName + 'Check']: checked }, fetchTable: false }));
  }

  onDateChange(): void {
    if (this.dateChecked && this.dateFrom?.getTime() > this.dateTo?.getTime()) {
      const temp = this.dateFrom;
      this.dateFrom = this.dateTo;
      this.dateTo = temp;
    } else if (!this.dateChecked) {
      this.dateTo = this.dateFrom;
    }

    const dateFrom = this.formatDate(this.dateFrom);
    const dateTo = this.formatDate(this.dateTo);

    this.store.dispatch(
      AddFiltersAction({
        filters: {
          [this.data.columnName + 'From']: dateFrom,
          [this.data.columnName + 'To']: dateTo
        },
        fetchTable: false
      })
    );
  }

  isFilterChecked(columnName: string, option: IFilteredColumnValue): boolean {
    const value = columnsToFilterByName.includes(columnName) ? option.en : option.key;

    return (this.allFilters?.[columnName] as string[])?.includes(value);
  }

  getOptionsForFiltering(): void {
    if (['city', 'district'].includes(this.data.columnName)) {
      iif(() => this.data.columnName === 'city', this.adminTableService.getCityList(), this.adminTableService.getDistrictList())
        .pipe(take(1))
        .subscribe((values) => {
          this.filteredValues = values;
        });
    } else {
      const columnsForFiltering = this.getColumnsForFiltering();
      this.filteredValues = columnsForFiltering.find((column) => column.key === this.data.columnName).values;
    }
  }

  getColumnsForFiltering(): IFilteredColumn[] {
    return this.adminTableService.columnsForFiltering;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
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
}
