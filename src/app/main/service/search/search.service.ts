import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SearchDataModel, SearchModel } from '../../model/search/search.model';
import { SearchDto } from 'src/app/main/component/layout/components/models/search-dto';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:3000';
  private backEndLink = environment.backendLink;
  private allElemsSubj = new Subject<any>();
  public searchSubject = new Subject<boolean>();
  public allSearchSubject = new Subject<boolean>();
  public allElements: SearchDto;

  public getAllResults(searchQuery: string, lang: string): Observable<SearchModel> {
    return this.http.get<SearchModel>(`${this.backEndLink}search?lang=${lang}&searchQuery=${encodeURI(searchQuery)}`);
  }

  public getAllResultsByCat(query: string, category = 'econews', page = 0, sort = '', items = 9): Observable<SearchDataModel> {
    return this.http.get<SearchDataModel>(
      `${this.backEndLink}search/${category}?searchQuery=${query}&sort=${sort}&page=${page}&size=${items}`
    );
  }

  private getResultsByCat(searchType: string): Observable<SearchModel> {
    return this.http.get<SearchModel>(`${this.apiUrl}/${searchType}`).pipe(switchMap((res) => of(res)));
  }

  public getAllSearch(searchQuery: string, searchType: string): Observable<SearchModel> {
    switch (searchType) {
      case 'relevance':
        return this.getResultsByCat('search');
      case 'newest':
        return this.getResultsByCat('newest');
      case 'latest':
        return this.getResultsByCat('noresults');
      default:
        return this.getResultsByCat('search');
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

  public getElementsAsObserv(): Observable<any> {
    return this.allElemsSubj.asObservable();
  }

  constructor(private http: HttpClient) {}
}
