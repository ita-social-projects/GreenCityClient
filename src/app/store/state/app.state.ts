import { RouterReducerState } from '@ngrx/router-store';
import { IBigOrderTableState, initialBigOrderTableState } from './bigOrderTable.state';
import { IEmployeesState, initialEmployeesState } from './employee.state';
import { IEcoNewsState, initialNewsState } from './ecoNews.state';
import { ILocationsState, initialLocationsState } from './tariff.state';
import { IEcoEventsState, initialEventsState } from './ecoEvents.state';
import { IOrderState, initialOrderState } from './order.state';
import { IFriendState, initialFriendState } from './friends.state';

export interface IAppState {
  friend: IFriendState;
  order: IOrderState;
  employees: IEmployeesState;
  locations: ILocationsState;
  bigOrderTable: IBigOrderTableState;
  router?: RouterReducerState;
  ecoNewsState: IEcoNewsState;
  ecoEventsState: IEcoEventsState;
}

export const initialAppState: IAppState = {
  friend: initialFriendState,
  order: initialOrderState,
  employees: initialEmployeesState,
  locations: initialLocationsState,
  bigOrderTable: initialBigOrderTableState,
  ecoNewsState: initialNewsState,
  ecoEventsState: initialEventsState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
