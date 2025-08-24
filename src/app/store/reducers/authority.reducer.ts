import { createReducer, on } from '@ngrx/store';
import { GetCategories, GetCategoriesSuccess, GetCategoriesFailure } from '../actions/authority.actions';
import { initialCategoryState } from '../state/authority.state';

export const authorityReducer = createReducer(
  initialCategoryState,
  on(GetCategories, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(GetCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories: categories,
    isLoading: false,
    error: null
  })),
  on(GetCategoriesFailure, (state, { error }) => ({
    ...state,
    categories: null,
    isLoading: false,
    error: error
  }))
);
