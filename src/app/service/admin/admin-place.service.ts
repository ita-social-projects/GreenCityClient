import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {PlaceStatus} from '../../model/place/place-status.model';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class AdminPlaceService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080/place';

  static getWeekDayShortForm(day: string): any {
    switch (day) {
      case 'MONDAY':
        return 'Mon';
      case 'TUESDAY':
        return 'Tue';
      case 'WEDNESDAY':
        return 'Wed';
      case 'THURSDAY':
        return 'Thu';
      case 'FRIDAY':
        return 'Fri';
      case 'SATURDAY':
        return 'Sat';
      case 'SUNDAY':
        return 'Sun';
      default : return day;
    }
  }

  getPlacesByStatus(status: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${status}`, httpOptions);
  }

  addPlaceStatus(placeStatus: PlaceStatus): Observable<PlaceStatus> {
    return this.http.patch<PlaceStatus>('http://localhost:8080/place/status', placeStatus, httpOptions);
  }
}
