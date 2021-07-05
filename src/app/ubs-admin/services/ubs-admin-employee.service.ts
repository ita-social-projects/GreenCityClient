import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UbsAdminEmployeeService {
  backend: string = environment.ubsAdmin.backendEmployeesLink;

  constructor(private http: HttpClient) {}

  getEmployees(page?: number, size?: number) {
    return this.http.get<any[]>(`${this.backend}?page=${page}&size=${size}`);
  }
}
