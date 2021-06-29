import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) {}
  url = 'https://greencity-ubs.azurewebsites.net/admin/ubs-employee/get-all-positions';
  url2 = 'https://greencity-ubs.azurewebsites.net/admin/ubs-employee/get-all-receiving-station';
  url3 = 'https://greencity-ubs.azurewebsites.net/admin/ubs-employee/save-employee';
  getAllPositions(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(tap((data) => console.log('All' + JSON.stringify(data))));
  }
  getAllStantions(): Observable<any[]> {
    return this.http.get<any[]>(this.url2).pipe(tap((data) => console.log('All' + JSON.stringify(data))));
  }
  postEmployee(data): Observable<any> {
    let addEmployeeDto = {
      email: 'test444@gmail.com',
      image: 'https://csb10032000a548f571.blob.core.windows.net/allfiles/4af6c99e-f2ec-4cab-bfb1-017f8c8b1ffbdefault_image.jpg',
      employeePositions: [
        {
          id: 1,
          name: 'Водій'
        }
      ],
      firstName: 'Tom',
      lastName: 'Tomson',
      phoneNumber: '+380993456111',
      receivingStations: [
        {
          id: 2,
          name: 'Петрівка'
        }
      ]
    };
    let headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryLhYsaCESHLVmVpqf',
      Accept: '*/*',
      'Accept-Language': 'uk,ru;q=0.9,ru-RU;q=0.8,en-US;q=0.7,en;q=0.6'
    });
    let options = { headers: headers };
    return this.http.post<any>(this.url3, addEmployeeDto, options);
  }
}
