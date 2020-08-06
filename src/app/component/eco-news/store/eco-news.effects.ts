import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { EcoNewsService } from '../services/eco-news.service';
import * as EcoNewsActions from './eco-news.actions';
import { mergeMap, switchMap } from 'rxjs/operators';
import { EcoNewsDto } from '../models/eco-news-dto';

@Injectable()
export class EcoNewsEffects {
  constructor(
    private $actions: Actions,
    private ecoNewsService: EcoNewsService
  ) {}

  // getNewsList method from the ecoNews Service is executed
  // and it returns newsList which is used as a argument for the 'SAVE_NEWS_LIST' action
  // after 'SAVE_NEWS_LIST' action dispatching, appropriate condition from the eco-news reducer will be invoked
  @Effect()
  getDefaultNewsList = this.$actions.pipe(
    ofType(EcoNewsActions.GET_DEFAULT_NEWS_LIST),
    switchMap(() => {
      return this.ecoNewsService.getNewsList();
    }),
    mergeMap((newsList: EcoNewsDto) => {
      const news = newsList.page;

      return [
        {
          type: EcoNewsActions.SAVE_NEWS_LIST,
          payload: news
        }];
    })
  );
}
