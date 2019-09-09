import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../../model/place/place';
import {MapBounds} from '../../model/map/map-bounds';
import {NgFlashMessageService} from "ng-flash-messages";
import {PlaceAddDto} from "../../model/placeAddDto.model";

@Injectable({
  providedIn: 'root'
})
export class PlaceServiceService {
  private baseUrl = 'http://localhost:8080/place/';

  constructor(private http: HttpClient, private ngFlashMessageService: NgFlashMessageService) {
  }

  gerListPlaceByMapsBoundsDto(mapBounds: MapBounds): Observable<Place[]> {
    return this.http.post<Place[]>(`${this.baseUrl}getListPlaceLocationByMapsBounds/`, mapBounds);
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
}
