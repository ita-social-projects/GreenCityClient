import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable, Subject } from 'rxjs';
import { SearchDataModel, SearchModel } from '../../model/search/search.model';
import { SearchDto } from 'src/app/main/component/layout/components/models/search-dto';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private backEndLink = environment.backendLink;
  private allElemsSubj = new Subject<any>();
  public searchSubject = new Subject<boolean>();
  public allSearchSubject = new Subject<boolean>();
  public allElements: SearchDto;

  public getAllResults(searchQuery: string, category, lang: string): Observable<SearchModel> {
    return this.http.get<SearchModel>(`${this.backEndLink}search/${category}?lang=${lang}&searchQuery=${encodeURI(searchQuery)}`);
  }

  public getAllResultsByCat(
    query: string,
    category: string = 'news',
    page: number = 0,
    sort: string = '',
    items: number = 9
  ): Observable<SearchDataModel> {
    return this.http.get<SearchDataModel>(
      `${this.backEndLink}search/${category}?searchQuery=${query}&sort=${sort}&page=${page}&size=${items}`
    );
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
