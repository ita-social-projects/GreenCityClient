import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PlaceServiceService {
  private baseUrl = 'http://localhost:8080/place';

  constructor(private http: HttpClient) {
  }

  gerListPlaceByMapsBoundsDto(mapsBounds: MapsBoundsDto): Observable<Place[]> {
    return this.http.post<Place[]>(`${this.baseUrl}/getListPlaceLocationByMapsBounds/`, mapsBounds);
  }
}
