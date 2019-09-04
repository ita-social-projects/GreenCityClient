import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {PlaceInfo} from "../../model/place/place-info";

@Injectable({
  providedIn: 'root'
})
export class PlaceServiceService {
  private baseUrl = 'http://localhost:8080/place/';

  constructor(private http: HttpClient) {
  }

  getListPlaceByMapsBoundsDto(mapBounds: MapBounds): Observable<Place[]> {
    return this.http.post<Place[]>(`${this.baseUrl}getListPlaceLocationByMapsBounds/`, mapBounds);
  }

  getPlaceInfo(id: number): Observable<PlaceInfo>{
  return this.http.get<PlaceInfo>(`${this.baseUrl}Info/${id}`)
  }
}
