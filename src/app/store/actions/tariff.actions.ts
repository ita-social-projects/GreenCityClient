import { createAction, props } from '@ngrx/store';
import { Locations, CreateLocation, EditLocationName } from 'src/app/ubs/ubs-admin/models/tariffs.interface';

export enum TariffActions {
  GetLocations = '[Tariff] Get Locations',
  GetLocationsSuccess = '[Tariff] Get Locations Success',
  AddLocations = '[Tariff] Add Locations',
  AddLocationsSuccess = '[Tariff] Add Locations Success',
  EditLocations = '[Tariff] Edit Location Name',
  EditLocationsSuccess = '[Tariff] Edit Location Name Success',
  ReceivedFailure = '[Tariff] Received Failure',
  UpdateLocations = '[Tariff] Update Location',
  UpdateLocationsSuccess = '[Tariff] Update Location Success'
}

export const GetLocations = createAction(TariffActions.GetLocations, props<{ reset: boolean }>());

export const GetLocationsSuccess = createAction(TariffActions.GetLocationsSuccess, props<{ locations: Locations[]; reset: boolean }>());

export const AddLocations = createAction(TariffActions.AddLocations, props<{ locations: CreateLocation[] }>());

export const AddLocationsSuccess = createAction(TariffActions.AddLocationsSuccess, props<{ locations: CreateLocation[] }>());

export const UpdateLocations = createAction(TariffActions.UpdateLocations, props<{ locations: Locations[] }>());

export const UpdateLocationsSuccess = createAction(TariffActions.UpdateLocationsSuccess, props<{ locations: Locations[] }>());

export const EditLocation = createAction(TariffActions.EditLocations, props<{ editedLocations: EditLocationName[] }>());

export const EditLocationSuccess = createAction(TariffActions.EditLocationsSuccess, props<{ editedLocations: EditLocationName[] }>());

export const ReceivedFailure = createAction(TariffActions.ReceivedFailure, props<{ error: string | null }>());
