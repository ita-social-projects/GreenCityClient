import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {PlaceInfo} from '../../model/place/place-info';
import {UpdatePlaceStatus} from '../../model/place/update-place-status.model';
import {PlacePageableDto} from '../../model/place/place-pageable-dto.model';
import {mainLink, placeLink} from '../../links';
import {NgFlashMessageService} from 'ng-flash-messages';
import {PlaceAddDto} from '../../model/placeAddDto.model';
import {AdminPlace} from '../../model/place/admin-place.model';
import {BulkUpdatePlaceStatus} from '../../model/place/bulk-update-place-status.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  private baseUrl = `${mainLink}place/`;
  private placeStatus: UpdatePlaceStatus;
  private bulkUpdateStatus: BulkUpdatePlaceStatus;
  private ids: string;

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
          messages: ['Cafe ' + place.name + ' was added for approving.'],
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

  updatePlaceStatus(id: number, status: string): Observable<UpdatePlaceStatus> {
    this.placeStatus = new UpdatePlaceStatus();
    this.placeStatus.id = id;
    this.placeStatus.status = status;

    return this.http.patch<UpdatePlaceStatus>(`${placeLink}status/`, this.placeStatus);
  }

  bulkUpdatePlaceStatuses(places: AdminPlace[], status: string): Observable<UpdatePlaceStatus[]> {
    this.bulkUpdateStatus = new BulkUpdatePlaceStatus();
    this.bulkUpdateStatus.ids = [];
    this.bulkUpdateStatus.status = status;

    places.forEach((item) => {
      this.bulkUpdateStatus.ids.push(item.id);
    });

    return this.http.patch<UpdatePlaceStatus[]>(`${placeLink}statuses`, this.bulkUpdateStatus);
  }

  delete(id: number): Observable<UpdatePlaceStatus> {
    return this.http.delete<UpdatePlaceStatus>(`${placeLink}` + id);
  }

  bulkDelete(places: AdminPlace[]): Observable<BulkUpdatePlaceStatus[]> {
    this.ids = '';

    places.forEach((item) => {
      this.ids += item.id + ',';
    });

    return this.http.delete<BulkUpdatePlaceStatus[]>(`${placeLink}?ids=${this.ids}`);
  }

  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${placeLink}statuses/`);
  }
}
