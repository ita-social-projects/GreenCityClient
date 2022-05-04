import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { createAction, props } from '@ngrx/store';

import { SafeUrl } from '@angular/platform-browser';
import { NewsDTO } from '@eco-news-models/create-news-interface';

export enum NewsActions {
  GetEcoNewsByTags = '[News] Get news by tags',
  GetEcoNewsByTagsSuccess = '[News] Get news by tags Success',
  GetEcoNewsByPage = '[News] Get news by page',
  GetEcoNewsByPageSuccess = '[News] Get news by page Success',
  GetEcoNewsByAuthor = '[News] Get news by author',
  GetEcoNewsByAuthorSuccess = '[News] Get news by author Success',

  EditEcoNews = '[News] Edit news',
  EditEcoNewsSuccess = '[News] Edit news Success'
}

export const GetEcoNewsByTagsAction = createAction(
  NewsActions.GetEcoNewsByTags,
  props<{ currentPage: number; numberOfNews: number; tagsList: string[]; reset: boolean }>()
);

export const GetEcoNewsByTagsSuccessAction = createAction(
  NewsActions.GetEcoNewsByTagsSuccess,
  props<{ ecoNews: EcoNewsDto; reset: boolean }>()
);

export const GetEcoNewsByPageAction = createAction(
  NewsActions.GetEcoNewsByPage,
  props<{ currentPage: number; numberOfNews: number; reset: boolean }>()
);

export const GetEcoNewsByPageSuccessAction = createAction(
  NewsActions.GetEcoNewsByPageSuccess,
  props<{ ecoNews: EcoNewsDto; reset: boolean }>()
);

export const GetEcoNewsByAuthorAction = createAction(
  NewsActions.GetEcoNewsByAuthor,
  props<{ currentPage: number; numberOfNews: number; reset: boolean }>()
);

export const GetEcoNewsByAuthorSuccessAction = createAction(
  NewsActions.GetEcoNewsByAuthorSuccess,
  props<{ ecoNews: EcoNewsDto; reset: boolean }>()
);

export const EditEcoNewsAction = createAction(NewsActions.EditEcoNews, props<{ form: NewsDTO }>());

export const EditEcoNewsSuccessAction = createAction(
  NewsActions.EditEcoNewsSuccess,
  props<{
    form: any;
  }>()
);
