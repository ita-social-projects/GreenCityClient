import { initialLocationsState } from '../state/tariff.state';
import { GetLocationsSuccess, AddLocationsSuccess, EditLocationSuccess, UpdateLocationsSuccess } from '../actions/tariff.actions';
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
  }),

  on(EditLocationSuccess, (state, action) => {
    const stateLocations = JSON.parse(JSON.stringify(state.locations));
    const editedLocations = [];
    stateLocations.forEach((stateLocation, stateLocationIndex) => {
      stateLocation.locationsDto.forEach((locationDto, locationDtoIndex) => {
        action.editedLocations.forEach((actionEditedLocation) => {
          if (locationDto.locationId === actionEditedLocation.locationId) {
            stateLocations[stateLocationIndex].locationsDto[locationDtoIndex].locationTranslationDtoList.forEach((location) => {
              location.locationName = location.languageCode === 'ua' ? actionEditedLocation.nameUa : actionEditedLocation.nameEn;
            });
          }
        });
      });
      editedLocations.push(stateLocation);
    });

    return {
      ...state,
      locations: editedLocations
    };
  })
);
