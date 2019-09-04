import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {PlaceStatus} from '../../model/place/place-status.model';
import {PlacePageableDto} from "../../model/place/place-pageable-dto.model";

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private baseUrl = 'https://greencitysoftserve.herokuapp.com/place/';
  private errorMsg: string;

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

  gerListPlaceByMapsBoundsDto(mapBounds: MapBounds): Observable<Place[]> {
    return this.http.post<Place[]>(`${this.baseUrl}getListPlaceLocationByMapsBounds/`, mapBounds);
  }

  getPlacesByStatus(status: string, paginationSettings: string): Observable<PlacePageableDto>{
    return this.http.get<PlacePageableDto>(`${this.baseUrl}${status}` + paginationSettings, httpOptions);
  }

  updatePlaceStatus(placeStatus: PlaceStatus) {
    return this.http.patch<PlaceStatus>(`${this.baseUrl}status/`, placeStatus, httpOptions);
  }
}
