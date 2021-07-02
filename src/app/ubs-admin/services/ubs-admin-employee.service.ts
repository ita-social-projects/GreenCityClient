import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ubsAdminEmployeeLink } from 'src/app/main/links';
@Injectable({
  providedIn: 'root'
})
export class UbsAdminEmployeeService {
  url = 'https://greencity-ubs.azurewebsites.net/admin/ubs-employee/getAll-employees';

  constructor(private http: HttpClient) {}

  getEmployees(page?: number, size?: number) {
    return this.http.get<any[]>(`${this.url}?page=${page}&size=${size}`);
  }
  getAllPositions(): Observable<any[]> {
    return this.http.get<any[]>(`${ubsAdminEmployeeLink}/get-all-positions`);
  }
  getAllStantions(): Observable<any[]> {
    return this.http.get<any[]>(`${ubsAdminEmployeeLink}/get-all-receiving-station`);
  }
  postEmployee(data): Observable<any> {
    return this.http.post<any>(`${ubsAdminEmployeeLink}/save-employee`, data);
  }
}
