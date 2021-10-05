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
    return this.http.get<any[]>(`${this.url}orders?columnName=${columnName}&page=${page}&size=${size}&sortingType=${sortingType}`);
  }

  getColumns() {
    return this.http.get(`${this.url}tableParams/0`);
  }

  postData(orderId: number[], columnName: string, newValue: string) {
    return this.http.post(`${this.url}changingOrder`, {
      orderId,
      columnName,
      newValue
    });
  }

  blockOrders(ids: number[]) {
    return this.http.post<IAlertInfo[]>(`${this.url}blockOrders`, ids);
  }
}
