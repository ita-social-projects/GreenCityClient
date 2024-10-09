import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';

export const bigOrderTableSelector = (store: IAppState) => store.bigOrderTable;

export const filtersSelector = createSelector(bigOrderTableSelector, (ubsUser) => ubsUser.filters);

export const isFiltersAppliedSelector = createSelector(bigOrderTableSelector, (ubsUser) => ubsUser.isFiltersApplied);
export const isNoFiltersAppliedSelector = createSelector(bigOrderTableSelector, (ubsUser) => !ubsUser.isFiltersApplied);

export const locationsDetailsSelector = createSelector(bigOrderTableSelector, (ubsUser) => ubsUser.locationsDetails);

export const regionsDetailsSelector = createSelector(bigOrderTableSelector, (ubsUser) => ubsUser.locationsDetails);

export const citiesDetailsSelector = createSelector(bigOrderTableSelector, (ubsUser) =>
  ubsUser.locationsDetails?.map((location) => location.cities).flat()
);

export const districtDetailsSelector = createSelector(bigOrderTableSelector, (ubsUser) =>
  ubsUser.locationsDetails
    ?.map((location) => location.cities)
    .flat()
    .map((city) => city.districts)
    .flat()
);
