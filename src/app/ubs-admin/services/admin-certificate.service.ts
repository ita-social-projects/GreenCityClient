import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AdminCertificateService {
  url = 'https://greencity-ubs.azurewebsites.net/ubs/management/getAllCertificates';

  constructor(private http: HttpClient) {}

  getTable(columnName?: string, page?: number, size?: number, sortingType?: string) {
    return this.http.get<any[]>(`${this.url}?columnName=${columnName}&page=${page}&size=${size}&sortingType=${sortingType}`);
  }
}
