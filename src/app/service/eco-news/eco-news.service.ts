import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EcoNewsModel} from '../../model/eco-news/eco-news-model';
import { Observable } from 'rxjs/Observable';
import { mockedBackApi } from '../../links';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class EcoNewsService {
  private url = mockedBackApi;
  public selectedId: number;
  public sortedLastThreeNews =  new Subject<Array<EcoNewsModel>>();
  constructor(private http: HttpClient) { }
    public getAllEcoNews(): Observable <Array<EcoNewsModel>> {
      return this.http.get<EcoNewsModel[]>(`${this.url}/eco-news`);
  }

  public sortLastThreeNewsChronologically(): any {
    this.http.get<EcoNewsModel[]>(`${this.url}/eco-news`)
      .pipe(take(1))
      .subscribe(
        (newsList: Array<EcoNewsModel>) => {
          this.onSortLastThreeNewsFinished(newsList, this.selectedId);
        }
     );
}

  private onSortLastThreeNewsFinished(data: EcoNewsModel[], id: number): void {
    const separetedNews: Array<EcoNewsModel> = [...data]
      .sort((a: any, b: any) => {
        const dateA: any = new Date(a.creationDate);
        const dateB: any = new Date(b.creationDate);
        return dateB - dateA;
      })
      .filter(news => news.id !== id)
      .splice(0, 3);
    this.sortedLastThreeNews.next(separetedNews);
  }
}
