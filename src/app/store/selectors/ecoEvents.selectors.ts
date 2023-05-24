import { createSelector } from '@ngrx/store';
import { IEcoEventsState } from '../state/ecoEvents.state';

export const selectFeatureError = (state: IEcoEventsState) => state.error;
export const selectFeatureStateError = createSelector(selectFeatureError, (error) => error);

export const selectFeatureSuccess = (state: IEcoEventsState) => state.eventsList;
export const selectFeatureStateSuccess = createSelector(selectFeatureSuccess, (eventsList) => eventsList);
