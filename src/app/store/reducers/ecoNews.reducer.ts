import { createReducer, on } from '@ngrx/store';
import {
  GetEcoNewsByPageSuccessAction,
  GetEcoNewsByTagsSuccessAction,
  GetEcoNewsByAuthorSuccessAction,
  CreateEcoNewsSuccessAction,
  EditEcoNewsSuccessAction,
  DeleteEcoNewsSuccessAction
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
        if (val && val.id === +action.editedNews.id) {
          return action.editedNews;
        }
        return val;
      }),
      autorNews: state.autorNews.map((value) => {
        if (value && value.id === +action.editedNews.id) {
          return action.editedNews;
        }
        return value;
      }),
      countOfEcoNews: action.editedNews.countOfEcoNews
    };
  }),

  on(CreateEcoNewsSuccessAction, (state, action) => {
    return {
      ...state,
      pages: [action.newEcoNews, ...state.pages],
      autorNews: [action.newEcoNews, ...state.autorNews],
      countOfEcoNews: action.newEcoNews.countOfEcoNews
    };
  }),

  on(DeleteEcoNewsSuccessAction, (state, action) => {
    const updatedPages = state.pages?.filter((newsPage) => newsPage.id !== +action.id);
    const updatedAuthorNews = state.autorNews?.filter((authorNews) => authorNews.id !== +action.id);
    const totalElements = state.ecoNewsByAuthor.totalElements;
    const totalElem = totalElements > 0 ? totalElements - 1 : totalElements;
    const updatedEcoNewsByAuthorPage = state.ecoNewsByAuthor.page?.filter((newsPage) => newsPage.id !== +action.id);
    return {
      ...state,
      pages: updatedPages || state.pages,
      autorNews: updatedAuthorNews || state.autorNews,
      ecoNewsByAuthor: {
        ...state.ecoNewsByAuthor,
        totalElements: totalElem,
        page: updatedEcoNewsByAuthorPage || state.ecoNewsByAuthor.page
      }
    };
  })
);
