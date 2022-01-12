import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlertInfo } from '../models/edit-cell.model';
import { environment } from '@environment/environment.js';

@Injectable({
  providedIn: 'root'
})
export class AdminTableService {
  url = environment.ubsAdmin.backendUbsAdminLink + '/management/';

  constructor(private http: HttpClient) {}

  getTable(columnName?: string, page?: number, filter?: string, size?: number, sortingType?: string, filters?: any[]) {
    // tslint:disable-next-line:max-line-length
    const BASE_QUERY = `${this.url}bigOrderTable?sortBy=${columnName}&pageNumber=${page}&search=${filter}&pageSize=${size}&sortDirection=${sortingType}`;
    let filtersQuery = '';
    if (filters.length) {
      filters.forEach((elem) => {
        const key = Object.keys(elem)[0];
        filtersQuery += `&${key}=${elem[key]}`;
      });
    }
    return this.http.get<any[]>(`${BASE_QUERY}${filtersQuery}`);
  }

  getColumns() {
    return this.http.get(`${this.url}tableParams/0`);
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
