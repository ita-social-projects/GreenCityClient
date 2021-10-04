import { Observable } from 'rxjs';
import { Employees } from './../models/ubs-admin.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { ubsAdminEmployeeLink } from 'src/app/main/links';

@Injectable({
  providedIn: 'root'
})
export class UbsAdminEmployeeService {
  backend: string = environment.ubsAdmin.backendEmployeesLink;

  constructor(private http: HttpClient) {}

  getEmployees(page?: number, size?: number): Observable<Employees> {
    return this.http.get<Employees>(`${this.backend}?page=${page}&size=${size}`);
  }

  getAllPositions(): Observable<any[]> {
    return this.http.get<any[]>(`${ubsAdminEmployeeLink}/get-all-positions`);
  }

  getAllStations(): Observable<any[]> {
    return this.http.get<any[]>(`${ubsAdminEmployeeLink}/get-all-receiving-station`);
  }

  postEmployee(data): Observable<any> {
    return this.http.post<any>(`${ubsAdminEmployeeLink}/save-employee`, data);
  }

  updateEmployee(data): Observable<any> {
    return this.http.put<any>(`${ubsAdminEmployeeLink}/update-employee`, data);
  }

  deleteEmployeeImage(id: number) {
    return this.http.delete(`${ubsAdminEmployeeLink}/delete-employee-image/${id}`);
  }
}
