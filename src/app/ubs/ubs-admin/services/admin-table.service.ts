import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlertInfo } from '../models/edit-cell.model';
import { environment } from '@environment/environment.js';
import { IBigOrderTable } from '../models/ubs-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminTableService {
  url = environment.ubsAdmin.backendUbsAdminLink + '/management/';

  constructor(private http: HttpClient) {}

  getTable(columnName?: string, page?: number, filter?: string, size?: number, sortingType?: string, filters?: any[]) {
    const SORT_BY_AND_PAGE_NUMBER = `sortBy=${columnName}&pageNumber=${page}`;
    const SEARCH_AND_PAGE_SIZE_AND_DIRECTION = filter ? `search=${filter}&` : '' + `pageSize=${size}&sortDirection=${sortingType}`;
    const BASE_QUERY = `${this.url}bigOrderTable?${SORT_BY_AND_PAGE_NUMBER}&${SEARCH_AND_PAGE_SIZE_AND_DIRECTION}`;
    let filtersQuery = '';
    if (filters.length) {
      filters.forEach((elem) => {
        const objKeys = Object.keys(elem);
        if (objKeys.length === 1) {
          const key = objKeys[0];
          filtersQuery += `&${key}=${elem[key]}`;
        }
        if (objKeys.length === 2) {
          const keyFrom = objKeys[0];
          const keyTo = objKeys[1];
          filtersQuery += `&${keyFrom}=${elem[keyFrom]}&${keyTo}=${elem[keyTo]}`;
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
}
