import { Component, ElementRef, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-column-filters-pop-up',
  templateUrl: './column-filters-pop-up.component.html',
  styleUrls: ['./column-filters-pop-up.component.scss']
})
export class ColumnFiltersPopUpComponent implements OnInit {
  isPopupOpened = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<ColumnFiltersPopUpComponent>,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.setPopupPosUnderButton();
  }

  @HostListener('document:click', ['$event'])
  public onClick(event: any) {
    const clickedInside = this.matDialogRef.componentInstance.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && this.isPopupOpened) {
      this.matDialogRef.close();
    }

    if (!this.isPopupOpened) {
      this.isPopupOpened = true;
    }
  }

  private setPopupPosUnderButton() {
    const rect = this.data.trigger.nativeElement.getBoundingClientRect();
    const position = { left: `${rect.left}px`, top: `${rect.top + rect.height}px` };

    if (rect.left + this.data.width > document.body.clientWidth) {
      position.left = `${rect.left + rect.width - this.data.width}px`;
    }
    this.matDialogRef.updatePosition(position);
    this.matDialogRef.updateSize(`${this.data.width}px`, `${this.data.height}px`);
  }

  changeColumnFilters(checked, curColumn, option) {
    const elem = {};
    const columnName = this.data.columnName;
    this.data.columnsForFiltering.find((column) => {
      if (column.key === curColumn.title.key) {
        column.values.find((value) => {
          if (value.key === option.key) {
            value.filtered = checked;
          }
        });
      }
    });
    if (checked) {
      elem[columnName] = option.key;
      this.data.filters.push(elem);
    } else {
      this.data.filters = this.data.filters.filter((filteredElem) => filteredElem[columnName] !== option.key);
    }
  }

  getDateChecked(): boolean {
    const currentColumnDateFilter = this.data.columnsForFiltering.find((column) => {
      return column.key === this.data.column.title.key;
    });
    return currentColumnDateFilter.values[0]?.filtered;
  }

  getDateValue(suffix: 'From' | 'To'): boolean {
    let date;
    const currentColumnDateFilter = this.data.columnsForFiltering.find((column) => {
      return column.key === this.data.column.title.key;
    });
    for (const key in currentColumnDateFilter?.values[0]) {
      if (key.includes(suffix)) {
        date = currentColumnDateFilter?.values[0]?.[key];
      }
    }
    return date;
  }

  changeDateFilters(checked: boolean): void {
    const elem = {};
    const popup = this.matDialogRef.componentInstance.elementRef.nativeElement;
    const columnName = this.data.columnName;
    const keyNameFrom = `${columnName}From`;
    const keyNameTo = `${columnName}To`;
    const inputDateFrom = popup.querySelector(`#dateFrom${columnName}`) as HTMLInputElement;
    const inputDateTo = popup.querySelector(`#dateTo${columnName}`) as HTMLInputElement;
    const dateFrom = inputDateFrom.value;
    let dateTo = inputDateTo.value;

    if (!dateTo) {
      dateTo = this.getTodayDate();
    }

    if (Date.parse(dateFrom) > Date.parse(dateTo)) {
      dateTo = dateFrom;
    }

    if (checked) {
      elem[keyNameFrom] = dateFrom;
      elem[keyNameTo] = dateTo;
      this.data.filters.push(elem);
      this.saveDateFilters(checked, this.data.column.title.key, elem);
    } else {
      this.data.filters = this.data.filters.filter((filteredElem) => !Object.keys(filteredElem).includes(`${keyNameFrom}`));
      this.saveDateFilters(checked, this.data.column.title.key, {});
    }
  }

  changeInputDateFilters(value: string, suffix: string): void {
    const columnName = this.data.columnName;
    const keyToChange = `${columnName}${suffix}`;
    const filterToChange = this.data.filters.find((filter) => Object.keys(filter).includes(`${keyToChange}`));

    if (filterToChange) {
      filterToChange[keyToChange] = value;
      if (Date.parse(filterToChange[`${columnName}From`]) > Date.parse(filterToChange[`${columnName}To`])) {
        filterToChange[`${columnName}To`] = filterToChange[`${columnName}From`];
      }
      const elem = { ...filterToChange };
      this.saveDateFilters(true, this.data.column.title.key, elem);
    }
  }

  private saveDateFilters(checked, currentColumn, elem) {
    this.data.columnsForFiltering.forEach((column) => {
      if (column.key === currentColumn) {
        column.values = [{ ...elem, filtered: checked }];
      }
    });
  }

  private getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();
    let todayDate: string;

    month = +month >= 10 ? month : `0${month}`;
    day = +day >= 10 ? day : `0${day}`;

    todayDate = `${year}-${month}-${day}`;

    return todayDate;
  }
}
