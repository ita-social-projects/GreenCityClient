import { RouterReducerState } from '@ngrx/router-store';
import { IEmployeesState, initialEmployeesState } from './employee.state';

export interface IAppState {
  employees: IEmployeesState;
  router?: RouterReducerState;
}

export const initialAppState: IAppState = {
  employees: initialEmployeesState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
