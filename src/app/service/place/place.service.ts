import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {PlaceStatus} from '../../model/place/place-status.model';
import {NgFlashMessageService} from 'ng-flash-messages';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private baseUrl = 'http://localhost:8080/place/';
  private errorMsg: string;

  constructor(private http: HttpClient, private ngFlashMessageService: NgFlashMessageService) {
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

  getPlacesByStatus(status: string) {

    return this.http.get(`${this.baseUrl}${status}`, httpOptions);
  }

  updatePlaceStatus(placeStatus: PlaceStatus) {
    return this.http.patch<PlaceStatus>(`${this.baseUrl}status/`, placeStatus, httpOptions).subscribe(
      () => {
        this.ngFlashMessageService.showFlashMessage({
          messages: [placeStatus.status === 'APPROVED' ? 'Approved' : 'Declined'],
          dismissible: true,
          timeout: 3000,
          type: 'success'
        });
        console.log(placeStatus.status === 'APPROVED' ? 'Approved' : 'Declined');
      },
      error => {
        this.errorMsg = 'Error. Item was not ';
        this.errorMsg += placeStatus.status === 'APPROVED' ? 'approved' : 'declined';
        this.errorMsg += '.Please try again';

        this.ngFlashMessageService.showFlashMessage({
          messages: [this.errorMsg],
          dismissible: true,
          timeout: 3000,
          type: 'danger'
        });
        console.log(error.error.message);
      }
    );
  }
}
