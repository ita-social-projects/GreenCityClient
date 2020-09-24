import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable, of, Subject} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SearchModel } from '../../model/search/search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:3000';
  private backEndLink = environment.backendLink;
  public searchSubject = new Subject<boolean>();
  public allSearchSubject = new Subject<boolean>();
  public allElements;
  private subject = new Subject<any>();

  public getSearch(searchQuery: string): Observable<SearchModel> {
    return this.http.get<SearchModel>(`${this.backEndLink}search?searchQuery=${searchQuery}`).pipe(
      switchMap(res => of(res))
    );
  }

  public getAllSearch(searchQuery: string, searchType: string): Observable<SearchModel> {
    switch (searchType) {
      case 'relevance': {
        return this.getResultsByCat('search');
        break;
      }
      case 'newest': {
        return this.getResultsByCat('newest');
        break;
      }
      case 'latest': {
        return this.getResultsByCat('noresults');
        break;
      }
      default: {
        return this.getResultsByCat('search');
      }
    }
  }

  private getResultsByCat(searchType: string): Observable<SearchModel> {
    return this.http.get<SearchModel>(`${this.apiUrl}/${searchType}`).pipe(
      switchMap(res => of(res))
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

  public getAllResults(query, category) {
    console.log(query);
    return this.http.get(`${this.backEndLink}search/${category}?page=0&searchQuery=${query}&size=5`)
      .subscribe(data => {
        this.allElements = data;
        this.subject.next(this.allElements);
      });
    }

  public getElementsAsObserv(): Observable<any> {
    return this.subject.asObservable();
  }

  constructor(private http: HttpClient) { }
}
