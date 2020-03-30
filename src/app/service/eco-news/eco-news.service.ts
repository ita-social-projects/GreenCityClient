import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EcoNewsModel } from '../../model/eco-news/eco-news-model';
import { environment } from '../../../environments/environment';
import { EcoNewsDto } from '../../model/eco-news/eco-news-dto';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class EcoNewsService {
  private backEnd = environment.backendLink;
  private newsList: Array<EcoNewsModel>;
  private newsListWithActiveFilter: Array<EcoNewsModel>;
  public newsListSubject = new Subject<Array<EcoNewsModel>>();
  public selectedId: number;
  public sortedLastThreeNews =  new Subject<Array<EcoNewsModel>>();

  constructor(private http: HttpClient) { }

  public getEcoNewsList() {
    this.http.get<EcoNewsDto>(`${this.backEnd}econews`)
      .pipe(take(1))
      .subscribe(
      (newsDto: EcoNewsDto) => {
        this.newsList = newsDto.page;
        this.newsListSubject.next(this.newsList);
      }
    );
  }

  public getEcoNewsById(id: number): Observable<EcoNewsModel> {
    return this.http.get<EcoNewsModel>(`${this.backEnd}econews/${id}`);
  }

  public sortLastThreeNewsChronologically(): void {
    this.http.get<EcoNewsDto>(`${this.backEnd}econews`)
      .pipe(take(1))
      .subscribe(
        (newsList: EcoNewsDto) => {
          this.onSortLastThreeNewsFinished(newsList.page, this.selectedId);
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