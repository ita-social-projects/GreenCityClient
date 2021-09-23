import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AdminCertificateService {
  url = 'https://greencity-ubs.azurewebsites.net/ubs/management/getAllCertificates';

  constructor(private http: HttpClient) {}

  getTable(page?: number, size?: number, sortingType?: string) {
    return this.http.get<any[]>(`${this.url}?page=${page}&size=${size}&sortingType=${sortingType}`);
  }
}
