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

  getEmployees(pageNumber?: number, pageSize?: number, search?: string, sortBy?: string, sortDirection?: string): Observable<Employees> {
    const urlAttr = [{ search }, { sortBy }, { sortDirection }].reduce(
      (acc, item) => (Object.values(item)[0] ? `${acc}&${Object.keys(item)[0]}=${Object.values(item)[0]}` : acc),
      ``
    );
    return this.http.get<Employees>(`${this.backend}?pageNumber=${pageNumber}&pageSize=${pageSize}${urlAttr}`);
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

  deleteEmployee(id: number) {
    return this.http.delete(`${ubsAdminEmployeeLink}/delete-employee/${id}`);
  }
}
