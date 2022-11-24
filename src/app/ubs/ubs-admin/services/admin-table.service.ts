import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlertInfo } from '../models/edit-cell.model';
import { environment } from '@environment/environment.js';
import { IBigOrderTable, IFilteredColumn, IFilteredColumnValue } from '../models/ubs-admin.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AdminTableService {
  columnsForFiltering: IFilteredColumn[] = [];
  filters: any[] = [];
  url = environment.ubsAdmin.backendUbsAdminLink + '/management/';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  getTable(columnName?: string, page?: number, filter?: string, size?: number, sortingType?: string) {
    const searchValue = filter ? filter.split(' ').reduce((values, value) => (value ? values + `search=${value}&` : values), '') : '';
    const SORT_BY_AND_PAGE_NUMBER = `sortBy=${columnName}&pageNumber=${page}`;
    const SEARCH_AND_PAGE_SIZE_AND_DIRECTION = searchValue + `pageSize=${size}&sortDirection=${sortingType}`;
    const BASE_QUERY = `${this.url}bigOrderTable?${SORT_BY_AND_PAGE_NUMBER}&${SEARCH_AND_PAGE_SIZE_AND_DIRECTION}`;
    let filtersQuery = '';
    if (this.filters.length) {
      this.filters.forEach((elem) => {
        const objKeys = Object.keys(elem);
        if (objKeys.length === 1) {
          const key = objKeys[0];
          filtersQuery += `&${key}=${elem[key]}`;
        }
        if (objKeys.length === 2) {
          const keyFrom = objKeys[0].replace('From', '.from');
          const keyTo = objKeys[1].replace('To', '.to');
          const key1 = objKeys[0];
          const key2 = objKeys[1];
          filtersQuery += `&${keyFrom}=${elem[key1]}&${keyTo}=${elem[key2]}`;
        }
      });
    }
    return this.http.get<IBigOrderTable>(`${BASE_QUERY}${filtersQuery}`);
  }

  getColumns() {
    return this.http.get(`${this.url}tableParams`);
  }

  postData(orderId: number[], columnName: string, newValue: string) {
    return this.http.put(`${this.url}changingOrder`, {
      orderId,
      columnName,
      newValue
    });
  }

  blockOrders(ids: number[]) {
    return this.http.put<IAlertInfo[]>(`${this.url}blockOrders`, ids);
  }

  public cancelEdit(ids: number[]) {
    return this.http.put(`${this.url}unblockOrders`, ids);
  }

  public howChangeCell(all: boolean, group: number[], single: number): number[] {
    if (all) {
      return [];
    }
    if (group.length) {
      return group;
    }
    if (!all && !group.length) {
      return [single];
    }
  }

  setColumnsForFiltering(columns): void {
    this.columnsForFiltering = columns;
  }

  public changeColumnNameEqualToEndPoint(column: string): string {
    let endPointColumnName: string;
    switch (column) {
      case 'dateOfExport':
        endPointColumnName = 'deliveryDate';
        break;
      case 'responsibleDriver':
        endPointColumnName = 'responsibleDriverId';
        break;
      case 'responsibleNavigator':
        endPointColumnName = 'responsibleNavigatorId';
        break;
      case 'responsibleCaller':
        endPointColumnName = 'responsibleCallerId';
        break;
      case 'responsibleLogicMan':
        endPointColumnName = 'responsibleLogicManId';
        break;
      default:
        endPointColumnName = column;
        break;
    }
    return endPointColumnName;
  }

  public changeColumnNameEqualToTable(column: string): string {
    let tableColumnName: string;
    switch (column) {
      case 'deliveryDate':
        tableColumnName = 'dateOfExport';
        break;
      case 'responsibleDriverId':
        tableColumnName = 'responsibleDriver';
        break;
      case 'responsibleNavigatorId':
        tableColumnName = 'responsibleNavigator';
        break;
      case 'responsibleCallerId':
        tableColumnName = 'responsibleCaller';
        break;
      case 'responsibleLogicManId':
        tableColumnName = 'responsibleLogicMan';
        break;
      default:
        tableColumnName = column;
        break;
    }
    return tableColumnName;
  }

  changeFilters(checked: boolean, currentColumn: string, option: IFilteredColumnValue): void {
    const elem = {};
    const columnName = this.changeColumnNameEqualToEndPoint(currentColumn);
    this.columnsForFiltering.find((column) => {
      if (column.key === currentColumn) {
        column.values.find((value) => {
          if (value.key === option.key) {
            value.filtered = checked;
          }
        });
      }
    });
    this.setColumnsForFiltering(this.columnsForFiltering);
    if (checked) {
      elem[columnName] = option.key;
      this.filters = [...this.filters, elem];
    } else {
      this.filters = this.filters.filter((filteredElem) => filteredElem[columnName] !== option.key);
    }
    this.setLocalStoreFilter(this.filters);
  }

  changeDateFilters(e: MatCheckboxChange, checked: boolean, currentColumn: string): void {
    const elem = {};
    const columnName = this.changeColumnNameEqualToEndPoint(currentColumn);
    const keyNameFrom = `${columnName}From`;
    const keyNameTo = `${columnName}To`;
    const checkboxParent = (e.source._elementRef.nativeElement as HTMLElement).parentElement;
    const inputDateFrom = checkboxParent.querySelector(`#dateFrom${currentColumn}`) as HTMLInputElement;
    const inputDateTo = checkboxParent.querySelector(`#dateTo${currentColumn}`) as HTMLInputElement;
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
      this.filters.push(elem);
      this.setLocalStoreFilter(this.filters);

      this.saveDateFilters(checked, currentColumn, elem);
    } else {
      this.filters = this.filters.filter((filteredElem) => !Object.keys(filteredElem).includes(`${keyNameFrom}`));
      this.filters = this.filters.filter((filteredElem) => !Object.keys(filteredElem).includes(`${keyNameTo}`));
      this.setLocalStoreFilter(this.filters);
      this.saveDateFilters(checked, currentColumn, {});
    }
  }

  changeInputDateFilters(value: string, currentColumn: string, suffix: string, check?: boolean): void {
    const elem = {};
    const dateFrom = value;
    const columnName = this.changeColumnNameEqualToEndPoint(currentColumn);
    const keyNameFrom = `${columnName}From`;
    const keyNameTo = `${columnName}To`;
    const keyToChange = `${columnName}${suffix}`;
    elem[keyNameFrom] = dateFrom;
    elem[keyNameTo] = dateFrom;
    const filterToChange = this.filters.find((filter) => Object.keys(filter).includes(`${keyToChange}`));

    if (!filterToChange) {
      elem[keyNameFrom] = dateFrom;
      this.filters.push(elem);
      this.saveDateFilters(false, columnName, this.filters);
    } else {
      filterToChange[keyToChange] = value;
      if (!check) {
        filterToChange[`${columnName}To`] = filterToChange[`${columnName}From`];
      }
      if (Date.parse(filterToChange[`${columnName}From`]) > Date.parse(filterToChange[`${columnName}To`])) {
        filterToChange[`${columnName}To`] = filterToChange[`${columnName}From`];
      }
      const element = { ...filterToChange };
      this.saveDateFilters(true, columnName, element);
    }
  }

  getDateChecked(dateColumn): boolean {
    const currentColumnDateFilter = this.columnsForFiltering.find((column) => {
      return column.key === dateColumn;
    });
    return currentColumnDateFilter.values[0]?.filtered;
  }

  setDateFormat(date): string {
    return this.convertDate(date);
  }

  convertDate = (date) => moment(date).format('YYYY-MM-DD');

  setDateCheckedFromStorage(dateColumn): void {
    const currentColumnDateFilter = this.columnsForFiltering.find((column) => {
      return column.key === dateColumn;
    });
    currentColumnDateFilter.values[0].filtered = true;
  }

  getDateValue(suffix: 'From' | 'To', dateColumn): boolean {
    let date;
    const currentColumnDateFilter = this.columnsForFiltering.find((column) => {
      return column.key === dateColumn;
    });
    for (const key in currentColumnDateFilter?.values[0]) {
      if (key.includes(suffix)) {
        date = currentColumnDateFilter?.values[0]?.[key];
      }
    }
    return date;
  }

  setLocalStoreFilter(filters: any[]): void {
    this.localStorageService.setUbsAdminOrdersTableTitleColumnFilter(filters);
  }

  public saveDateFilters(checked, currentColumn, elem) {
    this.columnsForFiltering.forEach((column) => {
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

  public setFilters(filters): void {
    this.filters = filters;
  }

  clearColumnFilters(column: string): void {
    const colName = this.changeColumnNameEqualToEndPoint(column);
    this.columnsForFiltering.forEach((col) => {
      if (col.key === colName) {
        col.values.forEach((value) => {
          value.filtered = false;
        });
      }
    });
    this.filters = this.filters.filter((filteredElem) => !filteredElem[colName]);
  }
}
