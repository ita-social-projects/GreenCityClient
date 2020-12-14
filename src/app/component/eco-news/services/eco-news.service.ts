import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, Observer, ReplaySubject, Subscription, throwError} from 'rxjs';
import {catchError, take, takeUntil} from 'rxjs/operators';
import { EcoNewsModel } from '../models/eco-news-model';
import { environment } from '@environment/environment';
import { EcoNewsDto } from '../models/eco-news-dto';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})

export class EcoNewsService implements OnDestroy {
  private backEnd = environment.backendLink;
  private language: string = this.localStorageService.getCurrentLanguage();
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {

    this.localStorageService.languageSubject
      .pipe(takeUntil(this.destroy))
      .subscribe(lang => this.language = lang);
  }

  public getAllPresentTags(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this.backEnd}econews/tags/all?lang=${this.language}`)
      .pipe(catchError(error => {
        console.log('Error: can not load all tags.');
        return throwError(error);
      }));
  }

  public getEcoNewsListByPage(page: number, quantity: number) {
    return this.http.get(`${this.backEnd}econews?page=${page}&size=${quantity}`);
  }

  public getNewsListByTags(page: number,
                           quantity: number,
                           tags: Array<string>) {
    return this.http.get(`${this.backEnd}econews/tags?page=${page}&size=${quantity}&tags=${tags}`);
  }

  public getNewsList(): Observable<any> {
    const headers = new HttpHeaders({'Content-type': 'application/json'});
    const ecoNewsObservable = new Observable((observer: Observer<any>) => {
      this.http.get<EcoNewsDto>(`${this.backEnd}econews`)
        .pipe(take(1))
        .subscribe(
          (newsDto: EcoNewsDto) => {
            observer.next(newsDto);
          }
        );
    });

    return ecoNewsObservable;
  }

  public getEcoNewsById(id: string): Observable<EcoNewsModel> {
    return this.http.get<EcoNewsModel>(`${this.backEnd}econews/${id}`);
  }

  public getRecommendedNews(id: number): Observable<EcoNewsModel> {
    return this.http.get<EcoNewsModel>(`${this.backEnd}econews/recommended?openedEcoNewsId=${id}`);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
