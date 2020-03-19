import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EcoNewsModel } from '../../model/eco-news/eco-news-model';
import { environment } from '../../../environments/environment';
import {EcoNewsDto} from '../../model/eco-news/eco-news-dto';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EcoNewsService {
  private backEnd = environment.backendLink;
  private newsList: Array<EcoNewsModel>;
  public newsListSubject = new Subject<Array<EcoNewsModel>>();

  constructor(private http: HttpClient) { }

  public getEcoNewsList() {
    this.http.get<EcoNewsDto>(`${this.backEnd}econews`).subscribe(
      (newsDto: EcoNewsDto) => {
        this.newsList = newsDto.page;
        this.newsListSubject.next(this.newsList);
      }
    );
  }
}
