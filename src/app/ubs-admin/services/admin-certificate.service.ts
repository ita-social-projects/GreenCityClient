import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCertificate } from '../models/ubs-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminCertificateService {
  url = 'https://greencity-ubs.azurewebsites.net/ubs/management';

  constructor(private http: HttpClient) {}

  getTable(column: string, page?: number, size?: number, sortingType?: string) {
    return this.http.get<any[]>(
      `${this.url}/getAllCertificates?columnName=${column}&page=${page}&size=${size}&sortingOrder=${sortingType}`
    );
  }

  createCertificate(certificate: CreateCertificate) {
    return this.http.post(`${this.url}/addCertificate`, certificate);
  }
}
