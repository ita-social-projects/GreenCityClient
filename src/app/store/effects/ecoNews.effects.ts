import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { EMPTY, of } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { GetEcoNewsByTags, GetEcoNewsByTagsSuccess, GetEcoNewsByPage, GetEcoNewsByPageSuccess } from '../actions/ecoNews.actions';
import { EcoNewsDto } from '@eco-news-models/eco-news-dto';

@Injectable()
export class NewsEffects {
  constructor(private actions: Actions, private newsService: EcoNewsService) {}

  getNewsListByTags = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEcoNewsByTags),
      mergeMap((actions: { currentPage: number; numberOfNews: number; tagsList: string[]; reset: boolean }) => {
        return this.newsService.getNewsListByTags(actions.currentPage, actions.numberOfNews, actions.tagsList).pipe(
          map(
            (ecoNews: EcoNewsDto) => GetEcoNewsByTagsSuccess({ ecoNews, reset: actions.reset }),
            catchError(() => EMPTY)
          )
        );
      })
    );
  });

  getEcoNewsListByPage = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEcoNewsByPage),
      mergeMap((actions: { currentPage: number; numberOfNews: number; reset: boolean }) => {
        return this.newsService.getEcoNewsListByPage(actions.currentPage, actions.numberOfNews).pipe(
          map(
            (ecoNews: EcoNewsDto) => GetEcoNewsByPageSuccess({ ecoNews, reset: actions.reset }),
            catchError(() => EMPTY)
          )
        );
      })
    );
  });
}
