import { createAction, props } from '@ngrx/store';
import { Locations, CreateLocation } from 'src/app/ubs/ubs-admin/models/tariffs.interface';

export enum TariffActions {
  GetLocations = '[Tariff] Get Locations',
  GetLocationsSuccess = '[Tariff] Get Locations Success',
  AddLocations = '[Tariff] Add Locations',
  AddLocationsSuccess = '[Tariff] Add Locations Success',
  ReceivedFailure = '[Tariff] Received Failure'
}

export const GetLocations = createAction(TariffActions.GetLocations, props<{ reset: boolean }>());

export const GetLocationsSuccess = createAction(TariffActions.GetLocationsSuccess, props<{ locations: Locations; reset: boolean }>());

export const AddLocations = createAction(TariffActions.AddLocations, props<{ locations: CreateLocation[] }>());

export const AddLocationsSuccess = createAction(TariffActions.AddLocationsSuccess, props<{ locations: CreateLocation[] }>());

export const ReceivedFailure = createAction(TariffActions.ReceivedFailure, props<{ error: string | null }>());
