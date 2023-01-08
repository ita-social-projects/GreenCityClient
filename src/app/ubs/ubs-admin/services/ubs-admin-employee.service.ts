import { BehaviorSubject, Observable } from 'rxjs';
import { Employees } from '../models/ubs-admin.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ubsAdminEmployeeLink, ubsAdminStationLink } from 'src/app/main/links';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UbsAdminEmployeeService {
  public getAllEmployees = `${ubsAdminEmployeeLink}/getAll-active-employees`;
  public searchValue: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  getEmployees(pageNumber?: number, pageSize?: number, search?: string, sortBy?: string, sortDirection?: string): Observable<Employees> {
    const urlAttr = [{ search }, { sortBy }, { sortDirection }].reduce(
      (acc, item) => (Object.values(item)[0] ? `${acc}&${Object.keys(item)[0]}=${Object.values(item)[0]}` : acc),
      ``
    );
    const tariffs = [
      {
        id: 1,
        region: {
          id: 1,
          nameEn: 'Kyiv region',
          nameUk: 'Київська обл'
        },
        locationsDtos: [
          {
            id: 1,
            nameEn: 'Kyiv',
            nameUk: 'Київ'
          },
          {
            id: 2,
            nameEn: '20km',
            nameUk: '20км'
          },
          {
            id: 4,
            nameEn: 'Irpin',
            nameUk: 'Ірпінь'
          },
          {
            id: 5,
            nameEn: 'Bila Tserkva',
            nameUk: 'Біла Церква'
          }
        ],
        courier: {
          id: 1,
          nameEn: 'UBS',
          nameUk: 'УБС'
        }
      },
      {
        id: 2,
        region: {
          id: 1,
          nameEn: 'Kyiv region',
          nameUk: 'Київська обл'
        },
        locationsDtos: [
          {
            id: 3,
            nameEn: 'Bucha',
            nameUk: 'Буча'
          }
        ],
        courier: {
          id: 1,
          nameEn: 'UBS',
          nameUk: 'УБС'
        }
      },
      {
        id: 3,
        region: {
          id: 2,
          nameEn: 'Lviv region',
          nameUk: 'Львівська обл'
        },
        locationsDtos: [
          {
            id: 14,
            nameEn: 'Lviv',
            nameUk: 'Львів'
          }
        ],
        courier: {
          id: 2,
          nameEn: 'Uklon',
          nameUk: 'Уклон'
        }
      }
    ];
    return this.http.get<Employees>(`${this.getAllEmployees}?pageNumber=${pageNumber}&pageSize=${pageSize}${urlAttr}`).pipe(
      map((res) => ({
        ...res,
        content: res.content.map((empl) => ({ ...empl, tariffs }))
      }))
    );
  }

  getAllPositions(): Observable<any[]> {
    return this.http.get<any[]>(`${ubsAdminEmployeeLink}/get-all-positions`);
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
    return this.http.delete(`${ubsAdminEmployeeLink}/delete-employee/${id}`);
  }

  getAllEmployeePermissions(email: string) {
    return this.http.get(`${ubsAdminEmployeeLink}/get-all-authorities/?email=${email}`);
  }

  updatePermissions(employeeId, permissions) {
    return this.http.put(`${ubsAdminEmployeeLink}/edit-authorities/`, { employeeId, authorities: permissions });
  }
}
