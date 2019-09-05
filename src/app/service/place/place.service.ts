import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {PlaceInfo} from '../../model/place/place-info';
import {PlaceStatus} from '../../model/place/place-status.model';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  //private baseUrl = 'https://greencitysoftserve.herokuapp.com/place/';
  protected baseUrl = 'http://localhost:8080/place/';

  constructor(private http: HttpClient) {
  }

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
      default :
        return day;
    }
  }

  getListPlaceByMapsBoundsDto(mapBounds: MapBounds): Observable<Place[]> {
    return this.http.post<Place[]>(`${this.baseUrl}getListPlaceLocationByMapsBounds/`, mapBounds);
  }

  getPlaceInfo(id: number): Observable<PlaceInfo>{
  return this.http.get<PlaceInfo>(`${this.baseUrl}Info/${id}`);
  }
  getFavoritePlaceInfo(id: number): Observable<PlaceInfo> {
    return this.http.get<PlaceInfo>(`${this.baseUrl}info/favorite/${id}`);
  }

  getPlacesByStatus(status: string) {

    return this.http.get(`${this.baseUrl}${status}`, httpOptions);
  }

  updatePlaceStatus(placeStatus: PlaceStatus) {
    return this.http.patch<PlaceStatus>(`${this.baseUrl}status/`, placeStatus, httpOptions);
  }
}
