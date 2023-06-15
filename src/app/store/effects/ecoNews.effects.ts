import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { EMPTY } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import {
  GetEcoNewsByTagsAction,
  GetEcoNewsByTagsSuccessAction,
  GetEcoNewsByPageAction,
  GetEcoNewsByPageSuccessAction,
  GetEcoNewsByAuthorAction,
  GetEcoNewsByAuthorSuccessAction,
  EditEcoNewsAction,
  EditEcoNewsSuccessAction,
  CreateEcoNewsAction,
  CreateEcoNewsSuccessAction,
  DeleteEcoNewsSuccessAction,
  DeleteEcoNewsAction
} from '../actions/ecoNews.actions';
import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { NewsDTO } from '@eco-news-models/create-news-interface';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

@Injectable()
export class NewsEffects {
  constructor(private actions: Actions, private newsService: EcoNewsService, private createEcoNewsService: CreateEcoNewsService) {}

  getNewsListByTags = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEcoNewsByTagsAction),
      mergeMap((actions: { currentPage: number; numberOfNews: number; tagsList: string[]; reset: boolean }) => {
        return this.newsService.getNewsListByTags(actions.currentPage, actions.numberOfNews, actions.tagsList).pipe(
          map(
            (ecoNews: EcoNewsDto) => GetEcoNewsByTagsSuccessAction({ ecoNews, reset: actions.reset }),
            catchError(() => EMPTY)
          )
        );
      })
    );
  });

  getEcoNewsListByPage = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEcoNewsByPageAction),
      mergeMap((actions: { currentPage: number; numberOfNews: number; reset: boolean }) => {
        return this.newsService.getEcoNewsListByPage(actions.currentPage, actions.numberOfNews).pipe(
          map(
            (ecoNews: EcoNewsDto) => GetEcoNewsByPageSuccessAction({ ecoNews, reset: actions.reset }),
            catchError(() => EMPTY)
          )
        );
      })
    );
  });

  getEcoNewsListByAutorId = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEcoNewsByAuthorAction),
      mergeMap((actions: { currentPage: number; numberOfNews: number; reset: boolean }) => {
        return this.newsService.getEcoNewsListByAutorId(actions.currentPage, actions.numberOfNews).pipe(
          map(
            (ecoNews: EcoNewsDto) => GetEcoNewsByAuthorSuccessAction({ ecoNews, reset: actions.reset }),
            catchError(() => EMPTY)
          )
        );
      })
    );
  });

  editNews = createEffect(() => {
    return this.actions.pipe(
      ofType(EditEcoNewsAction),
      mergeMap((actions: { form: NewsDTO }) => {
        return this.createEcoNewsService.editNews(actions.form).pipe(
          map(
            (editedNews: EcoNewsModel) => EditEcoNewsSuccessAction({ editedNews }),
            catchError(() => EMPTY)
          )
        );
      })
    );
  });

  createNews = createEffect(() => {
    return this.actions.pipe(
      ofType(CreateEcoNewsAction),
      mergeMap((actions: { value: NewsDTO }) => {
        return this.createEcoNewsService.sendFormData(actions.value).pipe(
          map(
            (newEcoNews: EcoNewsModel) => CreateEcoNewsSuccessAction({ newEcoNews }),
            catchError(() => EMPTY)
          )
        );
      })
    );
  });

  deleteNews = createEffect(() => {
    return this.actions.pipe(
      ofType(DeleteEcoNewsAction),
      mergeMap((actions: { id: number }) => {
        return this.newsService.deleteNews(actions.id).pipe(
          catchError((error) => {
            console.error('Помилка при видаленні новини', error);
            return EMPTY;
          })
        );
      })
    );
  });
}
