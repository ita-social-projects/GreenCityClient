import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { EcoNewsModel } from '../models/eco-news-model';
import { TagInterface } from '../../shared/components/tag-filter/tag-filter.model';
import { environment } from '@environment/environment';
import { EcoNewsDto } from '../models/eco-news-dto';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EcoNewsService implements OnDestroy {
  private backEnd = environment.backendLink;
  private language: string;
  private tagsType = 'ECO_NEWS';
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((language) => (this.language = language));
  }

  public getAllPresentTags(): Observable<Array<TagInterface>> {
    return this.http.get<Array<TagInterface>>(`${this.backEnd}tags/v2/search?type=${this.tagsType}`);
  }

  public getEcoNewsListByPage(page: number, quantity: number) {
    return this.http.get(`${this.backEnd}econews?page=${page}&size=${quantity}`);
  }

  public getEcoNewsListByAutorId(page: number, quantity: number) {
    return this.http.get(`${this.backEnd}econews/byUserPage?page=${page}&size=${quantity}`);
  }

  public getNewsListByTags(page: number, quantity: number, tags: Array<string>) {
    return this.http.get(`${this.backEnd}econews/tags?page=${page}&size=${quantity}&tags=${tags}`);
  }

  public getNewsList(): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json');
    return new Observable((observer: Observer<any>) => {
      this.http
        .get<EcoNewsDto>(`${this.backEnd}econews`)
        .pipe(take(1))
        .subscribe((newsDto: EcoNewsDto) => {
          observer.next(newsDto);
        });
    });
  }

  public getEcoNewsById(id: number): Observable<EcoNewsModel> {
    return this.http.get<EcoNewsModel>(`${this.backEnd}econews/${id}?lang=${this.language}`);
  }

  public getRecommendedNews(id: number): Observable<EcoNewsModel> {
    return this.http.get<EcoNewsModel>(`${this.backEnd}econews/recommended?openedEcoNewsId=${id}`);
  }

  public getIsLikedByUser(econewsId) {
    return this.http.get(`${this.backEnd}econews/isLikedByUser`, {
      params: {
        econewsId
      }
    });
  }

  public postToggleLike(id: number) {
    return this.http.post(`${this.backEnd}econews/like?id=${id}`, {});
  }

  public deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.backEnd}news/delete/${id}`);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
