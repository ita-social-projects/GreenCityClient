import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { createAction, props } from '@ngrx/store';

export enum NewsActions {
  GetEcoNewsByTags = '[News] Get news by tags',
  GetEcoNewsByTagsSuccess = '[News] Get news by tags Success',
  GetEcoNewsByPage = '[News] Get news by page',
  GetEcoNewsByPageSuccess = '[News] Get news by page Success'
}

export const GetEcoNewsByTags = createAction(
  NewsActions.GetEcoNewsByTags,
  props<{ currentPage: number; numberOfNews: number; tagsList: string[]; reset: boolean }>()
);

export const GetEcoNewsByTagsSuccess = createAction(NewsActions.GetEcoNewsByTagsSuccess, props<{ ecoNews: EcoNewsDto; reset: boolean }>());

export const GetEcoNewsByPage = createAction(
  NewsActions.GetEcoNewsByPage,
  props<{ currentPage: number; numberOfNews: number; reset: boolean }>()
);

export const GetEcoNewsByPageSuccess = createAction(NewsActions.GetEcoNewsByPageSuccess, props<{ ecoNews: EcoNewsDto; reset: boolean }>());
