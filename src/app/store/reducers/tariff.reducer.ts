import { initialLocationsState } from '../state/tariff.state';
import { GetLocationsSuccess, UpdateLocationsSuccess } from '../actions/tariff.actions';
import { createReducer, on } from '@ngrx/store';

export const tariffReducer = createReducer(
  initialLocationsState,
  on(GetLocationsSuccess, (state, action) => {
    const prevLocations = action.reset ? [] : state.locations ?? [];
    return {
      ...state,
      locations: [...prevLocations, ...action.locations]
    };
  }),

  on(UpdateLocationsSuccess, (state, action) => {
    return {
      ...state,
      locations: action.locations
    };
  })
);
