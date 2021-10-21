import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlertInfo } from '../models/edit-cell.model';

@Injectable({
  providedIn: 'root'
})
export class AdminTableService {
  url = 'https://greencity-ubs.azurewebsites.net/ubs/management/';

  constructor(private http: HttpClient) {}

  getTable(columnName?: string, page?: number, size?: number, sortingType?: string) {
    return this.http.get<any[]>(
      `${this.url}bigOrderTable?sortBy=${columnName}&pageNumber=${page}&pageSize=${size}&sortDirection=${sortingType}`
    );
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
