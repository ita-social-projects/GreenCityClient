import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UbsAdminEmployeeService {
  url = 'https://greencity-ubs.azurewebsites.net/admin/ubs-employee/getAll-employees';

  constructor(private http: HttpClient) {}

  getEmployees(page?: number, size?: number) {
    return this.http.get<any[]>(`${this.url}?page=${page}&size=${size}`);
  }
}
