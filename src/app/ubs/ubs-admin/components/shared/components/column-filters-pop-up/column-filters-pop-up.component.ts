import { MatCheckboxChange } from '@angular/material/checkbox';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { Component, ElementRef, HostListener, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilteredColumn, IFilteredColumnValue, IFilters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { DateAdapter } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LanguageModel } from '@eco-news-models/create-news-interface';
import { MatDatepicker } from '@angular/material/datepicker';
import { select, Store } from '@ngrx/store';
import moment from 'moment';
import { filtersSelector } from 'src/app/store/selectors/big-order-table.selectors';

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

  isPopupOpened = false;
  showButtons: boolean = false;

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
    this.showButtons = false;
  }

  initListeners(): void {
    this.store.pipe(takeUntil(this.destroy$), select(filtersSelector)).subscribe((filters: IFilters) => {
      this.allFilters = filters;
      this.adminTableService.setCurrentFilters(this.allFilters);

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

  onFilterChange(checked: boolean, currentColumn: string, option: IFilteredColumnValue): void {
    this.showButtons = true;
    this.adminTableService.setNewFilters(checked, currentColumn, option);
  }

  onDateChecked(e: MatCheckboxChange, checked: boolean): void {
    this.showButtons = true;
    this.onDateChange();
    this.adminTableService.setNewDateChecked(this.data.columnName, checked);
  }

  onDateChange(): void {
    this.showButtons = true;
    if (this.dateChecked && this.dateFrom?.getTime() > this.dateTo?.getTime()) {
      const temp = this.dateFrom;
      this.dateFrom = this.dateTo;
      this.dateTo = temp;
    } else if (!this.dateChecked) {
      this.dateTo = this.dateFrom;
    }

    const dateFrom = this.dateFrom ? this.formatDate(this.dateFrom) : '';
    const dateTo = this.dateTo ? this.formatDate(this.dateTo) : '';

    this.adminTableService.setNewDateRange(this.data.columnName, dateFrom, dateTo);
  }

  isChecked(columnName: string, option: IFilteredColumnValue): boolean {
    return this.adminTableService.isFilterChecked(columnName, option);
  }

  discardChanges(): void {
    console.log(this.allFilters);
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

  getOptionsForFiltering(): IFilteredColumnValue[] {
    const columnsForFiltering = this.getColumnsForFiltering();
    return columnsForFiltering.find((column) => column.key === this.data.columnName).values;
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
