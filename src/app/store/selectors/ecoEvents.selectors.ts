import { createSelector } from '@ngrx/store';
import { IEcoEventsState } from '../state/ecoEvents.state';

export const selectFeatureSuccess = (state: IEcoEventsState) => state.eventsList;
export const selectFeatureStateSuccess = createSelector(selectFeatureSuccess, (eventsList) => eventsList);
