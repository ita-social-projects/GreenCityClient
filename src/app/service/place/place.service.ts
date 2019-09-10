import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {PlaceInfo} from '../../model/place/place-info';
import {PlaceStatus} from '../../model/place/place-status.model';
import {PlacePageableDto} from '../../model/place/place-pageable-dto.model';
import {placeLink} from '../../links';

import {mainLink} from '../../links';
import {NgFlashMessageService} from 'ng-flash-messages';
import {PlaceAddDto} from '../../model/placeAddDto.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  private baseUrl = `${mainLink}place/`;

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

  getListPlaceByMapsBoundsDto(mapBounds: MapBounds): Observable<Place[]> {
    return this.http.post<Place[]>(`${placeLink}getListPlaceLocationByMapsBounds/`, mapBounds);
  }

  save(place: PlaceAddDto) {
    this.http.post(`${this.baseUrl}propose/`, place).subscribe(
      () => {
        this.ngFlashMessageService.showFlashMessage({
          messages: ["Cafe " + place.name + " was added for approving."],
          dismissible: true,
          timeout: 3000,
          type: 'success'
        });
      }
    );
  }

  getPlaceInfo(id: number): Observable<PlaceInfo> {
    return this.http.get<PlaceInfo>(`${placeLink}Info/${id}`);
  }

  getFavoritePlaceInfo(id: number): Observable<PlaceInfo> {
    return this.http.get<PlaceInfo>(`${placeLink}info/favorite/${id}`);
  }

  getPlacesByStatus(status: string, paginationSettings: string): Observable<PlacePageableDto> {
    return this.http.get<PlacePageableDto>(`${placeLink}${status}` + paginationSettings);
  }

  updatePlaceStatus(placeStatus: PlaceStatus) {
    return this.http.patch<PlaceStatus>(`${placeLink}status/`, placeStatus);
  }
}
