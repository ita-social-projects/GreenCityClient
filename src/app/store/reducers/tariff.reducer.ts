import { initialLocationsState } from '../state/tariff.state';
import { GetLocationsSuccess, AddLocationsSuccess } from '../actions/tariff.actions';
import { createReducer, on } from '@ngrx/store';

export const tariffReducer = createReducer(
  initialLocationsState,
  on(GetLocationsSuccess, (state, action) => {
    const prevLocations = action.reset ? [] : state.locations ?? [];
    return {
      ...state,
      locations: {
        ...state.locations,
        content: [...prevLocations, ...action.locations]
      }
    };
  }),

  on(AddLocationsSuccess, (state, action) => ({
    ...state,
    locations: {
      ...state.locations,
      new: [action.locations, { ...state.locations }]
    }
  }))
);
