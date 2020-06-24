import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardModel } from '../../../models/card.model';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  constructor(private http: HttpClient) { }

  private backEnd = environment.backendLink;

  public getFactsOfTheDay(): Observable<CardModel> {
    return this.http.get<CardModel>(`${this.backEnd}facts/dayFact/2?size=3`);
  }

}
