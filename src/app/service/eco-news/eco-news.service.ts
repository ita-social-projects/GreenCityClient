import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EcoNewsModel} from'../../model/eco-news/eco-news-model';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class EcoNewsService {
private _url:string='../../../assets/all-json/eco-news.json';

  constructor(private http:HttpClient) { }

  getAllEcoNews():Observable<EcoNewsModel[]>{
    return this.http.get<EcoNewsModel[]>(this._url);
  }
}
