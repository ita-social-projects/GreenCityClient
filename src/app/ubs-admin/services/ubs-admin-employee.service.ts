import { Observable } from 'rxjs';
import { Employees } from './../models/ubs-admin.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UbsAdminEmployeeService {
  backend: string = environment.ubsAdmin.backendEmployeesLink;

  constructor(private http: HttpClient) {}

  getEmployees(page?: number, size?: number): Observable<Employees> {
    return this.http.get<Employees>(`${this.backend}?page=${page}&size=${size}`);
  }
}
