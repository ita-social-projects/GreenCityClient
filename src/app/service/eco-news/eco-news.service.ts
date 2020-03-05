import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EcoNewsModel} from '../../model/eco-news/eco-news-model';
import { Observable } from 'rxjs/Observable';
import { mockedBackApi } from '../../links';

@Injectable({
  providedIn: 'root'
})
export class EcoNewsService {
private url = mockedBackApi;

  constructor(private http: HttpClient) { }

  public getAllEcoNews(): Observable <Array<EcoNewsModel>> {
    return this.http.get<EcoNewsModel[]>(`${this.url}/eco-news`);
  }
}
