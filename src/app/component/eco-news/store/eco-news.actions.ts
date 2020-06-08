import { Action } from '@ngrx/store';
import { EcoNewsModel } from '../models/eco-news-model';

export const GET_DEFAULT_NEWS_LIST = '[ECO_NEWS_MODULE] GET_DEFAULT_NEWS_LIST';
export const SAVE_NEWS_LIST = '[ECO_NEWS_MODULE] SAVE_NEWS_LIST';
export const GET_NEWS_LIST_BY_SELECTED_TAG = '[ECO_NEWS_MODULE] GET_NEWS_LIST_BY_SELECTED_TAG';

export class GetDefaultNewsList implements Action {
  readonly type = GET_DEFAULT_NEWS_LIST;
}

export class SaveNewsList implements Action {
  readonly type = SAVE_NEWS_LIST;

  constructor(public payload: Array<EcoNewsModel>) {}
}

export class GetNewsListBySelectedTag implements Action {
  readonly type = GET_NEWS_LIST_BY_SELECTED_TAG;

  constructor(public payload: Array<string>) {}
}

export type EcoNewsActions =
  GetDefaultNewsList |
  SaveNewsList |
  GetNewsListBySelectedTag;

