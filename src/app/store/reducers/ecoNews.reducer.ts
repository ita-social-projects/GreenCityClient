import { createReducer, on } from '@ngrx/store';
import { GetEcoNewsByPageSuccess, GetEcoNewsByTagsSuccess } from '../actions/ecoNews.actions';
import { initialNewsState } from '../state/ecoNews.state';

export const EcoNewsReducer = createReducer(
  initialNewsState,
  on(GetEcoNewsByPageSuccess, GetEcoNewsByTagsSuccess, (state, action) => {
    let prevLocations = state.pages;
    let prevNumber = state.pageNumber;
    if (action.reset) {
      prevLocations = [];
      prevNumber = 0;
    }
    return {
      ...state,
      pages: [...prevLocations, ...action.ecoNews.page],
      ecoNews: { ...action.ecoNews },
      pageNumber: prevNumber + 1
    };
  })
);
