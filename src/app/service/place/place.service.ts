import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';

@Injectable({
  providedIn: 'root'
})
export class PlaceServiceService {
  private baseUrl = 'https://greencitysoftserve.herokuapp.com/place/';

  constructor(private http: HttpClient) {
  }

  gerListPlaceByMapsBoundsDto(mapBounds: MapBounds): Observable<Place[]> {
    return this.http.post<Place[]>(`${this.baseUrl}getListPlaceLocationByMapsBounds/`, mapBounds);
  }
}
