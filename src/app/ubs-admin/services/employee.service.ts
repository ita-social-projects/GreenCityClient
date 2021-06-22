import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) {}
  url = 'https://greencity-ubs.azurewebsites.net/admin/ubs-employee/get-all-positions';
  url2 = 'https://greencity-ubs.azurewebsites.net/admin/ubs-employee/get-all-receiving-station';
  getAllPositions(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(tap((data) => console.log('All' + JSON.stringify(data))));
  }
  getAllStantions(): Observable<any[]> {
    return this.http.get<any[]>(this.url2).pipe(tap((data) => console.log('All' + JSON.stringify(data))));
  }
}
