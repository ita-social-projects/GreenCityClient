import { RouterReducerState } from '@ngrx/router-store';
import { IBigOrderTableState, initialBigOrderTableState } from './bigOrderTable.state';
import { IEmployeesState, initialEmployeesState } from './employee.state';

export interface IAppState {
  employees: IEmployeesState;
  bigOrderTable: IBigOrderTableState;
  router?: RouterReducerState;
}

export const initialAppState: IAppState = {
  employees: initialEmployeesState,
  bigOrderTable: initialBigOrderTableState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
