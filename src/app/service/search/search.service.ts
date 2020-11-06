import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable, of, Subject} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SearchModel } from '../../model/search/search.model';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { SearchDto } from 'src/app/component/layout/components/models/search-dto';

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

  public getSearch(searchQuery: string): Observable<SearchModel> {
    return this.http.get<SearchModel>(`${this.backEndLink}search?searchQuery=${searchQuery}`).pipe(
      switchMap(res => of(res))
    );
  }

  public getAllSearch(searchQuery: string, searchType: string): Observable<SearchModel> {
    switch (searchType) {
      case 'Relevance': {
        return this.getResultsByCat(searchQuery, 'search');
      }
      case 'Newest': {
        return this.getResultsByCat(searchQuery, 'newest');
      }
      case 'Oldest': {
        return this.getResultsByCat(searchQuery, 'noresults');
      }
      default: {
        return this.getResultsByCat(searchQuery, 'search');
      }
    }
  }

  private getResultsByCat(searchQuery: string, searchType: string): Observable<SearchModel> {
    return this.http.get<SearchModel>(`${this.backEndLink}search?/econews?page=0&searchQuery=${searchQuery}&sort=desc`).pipe(
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

  public getAllResults(query: string, category: string, page: number) {
    const itemsPerPage = 9;
    return this.http.get(`${this.backEndLink}search/${category}?page=${page}&searchQuery=${query}&size=${itemsPerPage}&sort=asc`)
    .pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.', 'X', 'red-snackbar');
        return error;
      })
    )
    .subscribe((data: SearchDto) => {
        console.log(data);
        this.allElements = data;
        this.allElemsSubj.next(this.allElements);
      });
    }

  public getElementsAsObserv(): Observable<any> {
    return this.allElemsSubj.asObservable();
  }

  constructor(private http: HttpClient,
              private snackBar: MatSnackBarComponent) { }
}
