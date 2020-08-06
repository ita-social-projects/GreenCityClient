import * as EcoNewsActions from './eco-news.actions';
import { EcoNewsModel } from '../models/eco-news-model';

export interface AppState {
  ecoNewsList: State;
}

export interface State {
  ecoNewsList: Array<EcoNewsModel>;
}

const initialState = {
  ecoNewsList: []
};

export function ecoNewsReducers(state = initialState, action: EcoNewsActions.EcoNewsActions) {
  switch (action.type) {
    case EcoNewsActions.SAVE_NEWS_LIST:
      return {
        ...state,
        ecoNewsList: action.payload
      };

    default:
      return {
        ...state
      };
  }
}
