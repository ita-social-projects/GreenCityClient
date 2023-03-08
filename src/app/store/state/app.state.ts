import { RouterReducerState } from '@ngrx/router-store';
import { IBigOrderTableState, initialBigOrderTableState } from './bigOrderTable.state';
import { IEmployeesState, initialEmployeesState } from './employee.state';
import { IEcoNewsState, initialNewsState } from './ecoNews.state';
import { ILocationsState, initialLocationsState } from './tariff.state';
import { IEcoEventsState, initialEventsState } from './ecoEvents.state';
import { IOrderStatus, initialOrderStatusState } from './orderStatus';

export interface IAppState {
  employees: IEmployeesState;
  locations: ILocationsState;
  bigOrderTable: IBigOrderTableState;
  router?: RouterReducerState;
  ecoNewsState: IEcoNewsState;
  ecoEventsState: IEcoEventsState;
  orderStatus: IOrderStatus;
}

export const initialAppState: IAppState = {
  employees: initialEmployeesState,
  locations: initialLocationsState,
  bigOrderTable: initialBigOrderTableState,
  ecoNewsState: initialNewsState,
  ecoEventsState: initialEventsState,
  orderStatus: initialOrderStatusState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
