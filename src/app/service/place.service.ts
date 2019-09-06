import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PlaceAddDto} from '../model/placeAddDto.model';
import {placeLink} from "../links";


@Injectable({providedIn: 'root'})
export class PlaceService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  save(place: PlaceAddDto) {
    console.log(place);
    this.http.post(`${placeLink}propose`, place)
      .subscribe(res => console.log('Done'));
  }

}
