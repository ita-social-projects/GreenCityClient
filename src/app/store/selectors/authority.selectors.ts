import { IAppState } from '../state/app.state';
import { createSelector } from '@ngrx/store';

export const selectAuthorityState = (state: IAppState) => state.authority;

export const selectCategories = createSelector(selectAuthorityState, (state) => state.categories);
