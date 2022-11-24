import { MatCheckboxChange } from '@angular/material/checkbox';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { Component, ElementRef, HostListener, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilteredColumn, IFilteredColumnValue } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { DateAdapter } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LanguageModel } from '@eco-news-models/create-news-interface';

@Component({
  selector: 'app-column-filters-pop-up',
  templateUrl: './column-filters-pop-up.component.html',
  styleUrls: ['./column-filters-pop-up.component.scss']
})
export class ColumnFiltersPopUpComponent implements OnInit {
  isPopupOpened = false;
  isCalendarOpened = false;
  private localStorageService: LocalStorageService;
  public currentLang: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<ColumnFiltersPopUpComponent>,
    private elementRef: ElementRef,
    private adapter: DateAdapter<LanguageModel>,
    private injector: Injector,
    private adminTableService: AdminTableService
  ) {
    this.localStorageService = injector.get(LocalStorageService);
  }

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.currentLang = lang;
      const locale = lang !== 'ua' ? 'en-GB' : 'uk-UA';
      this.adapter.setLocale(locale);
    });
    this.setPopupPosUnderButton();
  }

  @HostListener('document:click', ['$event'])
  public onClick(event: any) {
    const clickedInside = this.matDialogRef.componentInstance.elementRef.nativeElement.contains(event.target);
    const isCalendarOpened = event.target?.className === 'mat-calendar-body-cell-content mat-calendar-body-selected';

    if (!clickedInside && this.isPopupOpened && !isCalendarOpened) {
      this.matDialogRef.close();
    }

    if (!this.isPopupOpened) {
      this.isPopupOpened = true;
    }
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

  changeColumnFilters(checked: boolean, currentColumn: string, option: IFilteredColumnValue): void {
    this.adminTableService.changeFilters(checked, currentColumn, option);
  }

  getDateChecked(): boolean {
    return this.adminTableService.getDateChecked(this.data.columnName);
  }

  getDateValue(suffix: 'From' | 'To'): boolean {
    return this.adminTableService.getDateValue(this.data.columnName, suffix);
  }

  changeDateFilters(e: MatCheckboxChange, checked: boolean): void {
    this.adminTableService.changeDateFilters(e, checked, this.data.columnName);
  }

  changeInputDateFilters(value: string, suffix: string): void {
    this.adminTableService.changeInputDateFilters(value, this.data.columnName, suffix);
  }

  getOptionsForFiltering() {
    const columnsForFiltering = this.getColumnsForFiltering();
    let filteredCol: IFilteredColumn;

    filteredCol = columnsForFiltering.find((column) => column.key === this.data.columnName);

    return filteredCol.values;
  }

  getColumnsForFiltering() {
    return this.adminTableService.columnsForFiltering;
  }
}
