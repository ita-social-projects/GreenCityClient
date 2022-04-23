import { createReducer, on } from '@ngrx/store';
import { GetEcoNewsByPageSuccess, GetEcoNewsByTagsSuccess } from '../actions/ecoNews.actions';
import { initialNewsState } from '../state/ecoNews.state';

export const EcoNewsReducer = createReducer(
  initialNewsState,
  on(GetEcoNewsByPageSuccess, GetEcoNewsByTagsSuccess, (state, action) => {
    let prevLocations = state.page;
    let prevNumber = state.pageNumber;
    if (action.reset) {
      prevLocations = [];
      prevNumber = 0;
    }
    return {
      ...state,
      page: [...prevLocations, ...action.ecoNews.page],
      ecoNews: { ...state.ecoNews, ...action.ecoNews },
      pageNumber: prevNumber + 1
    };
  })
);
