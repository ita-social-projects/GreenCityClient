import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EcoNewsModel } from '../models/eco-news-model';
import { environment } from '../../../../environments/environment';
import { EcoNewsDto } from '../models/eco-news-dto';
import {Observable, Observer, Subject} from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class EcoNewsService {
  private backEnd = environment.backendLink;
  public sortedLastThreeNews =  new Subject<Array<EcoNewsModel>>();

  constructor(private http: HttpClient) { }

  public getAllPresentTags(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this.backEnd}econews/ecoNewsTags`);
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

  public getEcoNewsById(id: number): Observable<EcoNewsModel> {
    return this.http.get<EcoNewsModel>(`${this.backEnd}econews/${id}`);
  }

  public sortLastThreeNewsChronologically(id): void {
    this.http.get<EcoNewsDto>(`${this.backEnd}econews`)
      .pipe(take(1))
      .subscribe(
        (newsList: EcoNewsDto) => {
          this.onSortLastThreeNewsFinished(newsList.page, id);
        }
     );
  }

  private onSortLastThreeNewsFinished(data: EcoNewsModel[], id: number): void {
    const separetedNews: Array<EcoNewsModel> = [...data]
      .sort((a: any, b: any) => {
        const dateFirstAdded: number = +new Date(a.creationDate);
        const dateLastAdded: number = +new Date(b.creationDate);
        return dateLastAdded - dateFirstAdded;
      })
      .filter(news => news.id !== id)
      .splice(0, 3);
    this.sortedLastThreeNews.next(separetedNews);
  }
}
