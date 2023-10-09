import { RouterReducerState } from '@ngrx/router-store';
import { IBigOrderTableState, initialBigOrderTableState } from './bigOrderTable.state';
import { IEmployeesState, initialEmployeesState } from './employee.state';
import { IEcoNewsState, initialNewsState } from './ecoNews.state';
import { ILocationsState, initialLocationsState } from './tariff.state';
import { IEcoEventsState, initialEventsState } from './ecoEvents.state';
import { IOrderState, initialOrderState } from './order.state';
import { initialHabitState } from './habit.state';
import { HabitInterface as IHabitState } from '@global-user/components/habit/models/interfaces/habit.interface';

export interface IAppState {
  order: IOrderState;
  employees: IEmployeesState;
  locations: ILocationsState;
  bigOrderTable: IBigOrderTableState;
  router?: RouterReducerState;
  ecoNewsState: IEcoNewsState;
  ecoEventsState: IEcoEventsState;
  habit: IHabitState;
}

export const initialAppState: IAppState = {
  order: initialOrderState,
  employees: initialEmployeesState,
  locations: initialLocationsState,
  bigOrderTable: initialBigOrderTableState,
  ecoNewsState: initialNewsState,
  ecoEventsState: initialEventsState,
  habit: initialHabitState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
