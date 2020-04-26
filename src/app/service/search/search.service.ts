import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { SearchModel } from '../../model/search/search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private backEndLink = environment.backendLink;

  public getSearch(searchQuery: string): Observable<SearchModel> {

    return this.http.get<SearchModel>('http://localhost:3000/ecoNews');
    // return this.http.get<SearchModel>(`${this.backEndLink}search/${searchQuery}`);
  }

  constructor(private http: HttpClient) { }
}
