import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';

export const bigOrderTableSelector = (store: IAppState) => store.bigOrderTable;

export const filtersSelector = createSelector(bigOrderTableSelector, (ubsUser) => ubsUser.filters);

export const isFiltersAppliedSelector = createSelector(bigOrderTableSelector, (ubsUser) => ubsUser.isFiltersApplied);
export const isNoFiltersAppliedSelector = createSelector(bigOrderTableSelector, (ubsUser) => !ubsUser.isFiltersApplied);
