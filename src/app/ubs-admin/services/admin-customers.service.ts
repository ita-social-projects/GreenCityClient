import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminCustomersService {
  url = 'https://greencity-ubs.azurewebsites.net/ubs/management';

  constructor(private http: HttpClient) {}

  getCustomers(column: string, page?: number, size?: number, sortingType?: string) {
    return this.http.get<any[]>(`${this.url}/usersAll`);
  }
}
