import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { SearchModel } from '../../model/search/search.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private backEndLink = environment.backendLink;
  public searchSubject = new Subject<boolean>();
  public allSearchSubject = new Subject<boolean>();

  public getSearch(searchQuery: string): Observable<SearchModel> {
    return this.http.get<SearchModel>(`${this.backEndLink}search?searchQuery=${searchQuery}`).pipe(
      switchMap(res => of(res))
    );
  }

  public getAllSearch(searchQuery: string, searchType: string): Observable<SearchModel> {
    switch (searchType) {
      case 'relevance': {
        return this.http.get<SearchModel>('http://localhost:3000/search').pipe(
          switchMap(res => of(res))
        );
        break;
      }
      case 'newest': {
        return this.http.get<SearchModel>('http://localhost:3000/search').pipe(
          switchMap(res => of(res))
        );
        break;
      }
      case 'latest': {
        return this.http.get<SearchModel>('http://localhost:3000/noresults').pipe(
          switchMap(res => of(res))
        );
        break;
      }
      default: {
        return this.http.get<SearchModel>('http://localhost:3000/search').pipe(
          switchMap(res => of(res))
        );
      }
    }
  }

  public toggleSearchModal() {
    this.searchSubject.next(true);
  }

  public closeSearchSignal() {
    this.searchSubject.next(false);
  }

  public toggleAllSearch(value) {
    this.allSearchSubject.next(value);
  }

  constructor(private http: HttpClient) { }
}
