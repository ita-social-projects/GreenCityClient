import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';

export const bigOrderTableSelector = (store: IAppState) => store.bigOrderTable;
export const filtersSelector = createSelector(bigOrderTableSelector, (state) => state.filters);
export const isFiltersAppliedSelector = createSelector(bigOrderTableSelector, (state) => state.isFiltersApplied);
export const isNoFiltersAppliedSelector = createSelector(bigOrderTableSelector, (state) => !state.isFiltersApplied);
export const locationsDetailsSelector = createSelector(bigOrderTableSelector, (state) => state.locationsDetails);
export const regionsDetailsSelector = createSelector(bigOrderTableSelector, (state) => state.locationsDetails);
export const citiesDetailsSelector = createSelector(bigOrderTableSelector, (state) =>
  state.locationsDetails?.map((location) => location.cities).flat()
);
export const districtDetailsSelector = createSelector(bigOrderTableSelector, (state) =>
  state.locationsDetails
    ?.map((location) => location.cities)
    .flat()
    .map((city) => city.districts)
    .flat()
);
export const isOrderAddressLoadingSelector = createSelector(bigOrderTableSelector, (tableOrder) => tableOrder.isOrderAddressLoading);
export const columnWidthSelector = createSelector(bigOrderTableSelector, (state) => state.tableColumnWidth);
