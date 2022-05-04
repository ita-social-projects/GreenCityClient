import { createReducer, on } from '@ngrx/store';
import {
  GetEcoNewsByPageSuccessAction,
  GetEcoNewsByTagsSuccessAction,
  GetEcoNewsByAuthorSuccessAction,
  EditEcoNewsSuccessAction
} from '../actions/ecoNews.actions';
import { initialNewsState } from '../state/ecoNews.state';

export const EcoNewsReducer = createReducer(
  initialNewsState,
  on(GetEcoNewsByPageSuccessAction, GetEcoNewsByTagsSuccessAction, (state, action) => {
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
  }),
  on(GetEcoNewsByAuthorSuccessAction, (state, action) => {
    let prevAuthorNews = state.autorNews;
    let prevNumber = state.authorNewsPage;
    if (action.reset) {
      prevAuthorNews = [];
      prevNumber = 0;
    }
    return {
      ...state,
      autorNews: [...prevAuthorNews, ...action.ecoNews.page],
      ecoNewsByAuthor: { ...action.ecoNews },
      authorNewsPage: prevNumber + 1
    };
  }),

  on(EditEcoNewsSuccessAction, (state, action) => {
    return {
      ...state,
      pages: state.pages.map((val) => {
        if (val.id === +action.form.id) {
          const newOrderData = { ...val };
          // val.content = action.form.content;
          newOrderData.imagePath = action.form.imagePath;
          newOrderData.title = action.form.title;
          newOrderData.tags = [...action.form.tags];
          newOrderData.source = action.form.source;
          return newOrderData;
        }
        return val;
      })
    };
  })
);
