import {BaseService} from './base-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PlaceAddDto} from '../model/placeAddDto.model';
import {Observable} from "rxjs";
import {PlaceWithUserModel} from "../model/placeWithUser.model";

@Injectable({providedIn: 'root'})
export class PlaceService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http);
    this.apiUrl += '/place';
  }

  save(place: PlaceAddDto): Observable<PlaceWithUserModel> {
    return this.http.post<PlaceWithUserModel>(`${this.apiUrl}/propose`, place);
  }

}
