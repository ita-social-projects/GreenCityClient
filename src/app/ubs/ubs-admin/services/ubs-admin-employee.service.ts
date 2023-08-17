import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Employees, EmployeePositions, EmployeePositionsAuthorities } from '../models/ubs-admin.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ubsAdminEmployeeLink, ubsAdminStationLink } from 'src/app/main/links';
import { FilterData } from '../models/tariffs.interface';

@Injectable({
  providedIn: 'root'
})
export class UbsAdminEmployeeService {
  public getAllEmployees = `${ubsAdminEmployeeLink}/getAll-employees`;
  public searchValue: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public filterDataSubject$: Subject<FilterData> = new Subject<FilterData>();
  public employeePositionsAuthorities$: Subject<EmployeePositionsAuthorities> = new Subject<EmployeePositionsAuthorities>();
  public employeePositions$: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  constructor(private http: HttpClient) {}

  getEmployees(
    pageNumber?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortDirection?: string,
    data?
  ): Observable<Employees> {
    const urlAttr = [{ search }, { sortBy }, { sortDirection }].reduce(
      (acc, item) => (Object.values(item)[0] ? `${acc}&${Object.keys(item)[0]}=${Object.values(item)[0]}` : acc),
      ``
    );

    return this.http.get<Employees>(`${this.getAllEmployees}?pageNumber=${pageNumber}&pageSize=${pageSize}${urlAttr}`, {
      params: data
    });
  }

  getAllPositions(): Observable<EmployeePositions[]> {
    return this.http.get<EmployeePositions[]>(`${ubsAdminEmployeeLink}/get-all-positions`);
  }

  getAllStations(): Observable<any[]> {
    return this.http.get<any[]>(`${ubsAdminStationLink}/get-all-receiving-station`);
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
    return this.http.put(`${ubsAdminEmployeeLink}/deactivate-employee/${id}`, id);
  }

  getAllEmployeePermissions(email: string) {
    return this.http.get(`${ubsAdminEmployeeLink}/get-all-authorities/?email=${email}`);
  }

  updatePermissions(employeeEmail, permissions) {
    return this.http.put(`${ubsAdminEmployeeLink}/edit-authorities/`, { employeeEmail, authorities: permissions });
  }

  getEmployeeLoginPositions(employeeEmail): Observable<any> {
    return this.http.get(`${ubsAdminEmployeeLink}/get-employee-login-positions/?email=${employeeEmail}`);
  }

  getEmployeePositionsAuthorities(employeeEmail): Observable<any> {
    return this.http.get(`${ubsAdminEmployeeLink}/get-positions-authorities/?email=${employeeEmail}`);
  }

  updateFilterData(data: FilterData) {
    this.filterDataSubject$.next(data);
  }
}
