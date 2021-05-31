import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AdminTableService {
  url = 'https://greencity-ubs.azurewebsites.net/ubs/management/getAllFieldsFromOrderTable';

  constructor(private http: HttpClient) {}

  getTable(columnName?: string, sortingType?: string) {
    return this.http.get<any[]>(`${this.url}/?columnName=${columnName}&sortingType=${sortingType}`);
  }
}
