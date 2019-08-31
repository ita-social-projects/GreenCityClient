import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PlaceAddDto} from '../model/placeAddDto.model';

@Injectable({providedIn: 'root'})
export class PlaceService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http);
    this.apiUrl += '/place';
  }

  save(place: PlaceAddDto) {
    return this.http.post(`${this.apiUrl}/propose`, place);
  }

}
