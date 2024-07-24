import { RouterReducerState } from '@ngrx/router-store';
import { IBigOrderTableState, initialBigOrderTableState } from './bigOrderTable.state';
import { IEmployeesState, initialEmployeesState } from './employee.state';
import { IEcoNewsState, initialNewsState } from './ecoNews.state';
import { ILocationsState, initialLocationsState } from './tariff.state';
import { IEcoEventsState, initialEventsState } from './ecoEvents.state';
import { IOrderState, initialOrderState } from './order.state';
import { IFriendState, initialFriendState } from './friends.state';
import { initialHabitState } from './habit.state';
import { HabitInterface as IHabitState } from '@global-user/components/habit/models/interfaces/habit.interface';
import { initialUbsUserState, IUbsUserState } from 'src/app/store/state/ubs-user.state';
import { IAuthState, initialAuthState } from 'src/app/store/state/auth.state';

export interface IAppState {
  auth: IAuthState;
  friend: IFriendState;
  order: IOrderState;
  employees: IEmployeesState;
  locations: ILocationsState;
  bigOrderTable: IBigOrderTableState;
  router?: RouterReducerState;
  ecoNewsState: IEcoNewsState;
  ecoEventsState: IEcoEventsState;
  habit: IHabitState;
  ubsUser: IUbsUserState;
}

export const initialAppState: IAppState = {
  auth: initialAuthState,
  friend: initialFriendState,
  order: initialOrderState,
  employees: initialEmployeesState,
  locations: initialLocationsState,
  bigOrderTable: initialBigOrderTableState,
  ecoNewsState: initialNewsState,
  ecoEventsState: initialEventsState,
  habit: initialHabitState,
  ubsUser: initialUbsUserState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
