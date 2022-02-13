import { RouterReducerState } from '@ngrx/router-store';
import { IEmployeesState, initialEmployeesState } from './employee.state';
import { ILocationsState, initialLocationsState } from './tariff.state';

export interface IAppState {
  employees: IEmployeesState;
  locations: ILocationsState;
  router?: RouterReducerState;
}

export const initialAppState: IAppState = {
  employees: initialEmployeesState,
  locations: initialLocationsState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
