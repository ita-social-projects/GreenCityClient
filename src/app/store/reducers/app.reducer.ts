import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { routerReducer } from '@ngrx/router-store';
import { employeesReducer } from './employee.reducer';
import { tariffReducer } from './tariff.reducer';
import { bigOrderTableReducer } from './bigOrderTable.reducer';
import { EcoNewsReducer } from './ecoNews.reducer';
import { EcoEventsReducer } from './ecoEvents.reducer';
import { orderReducer } from './order.reducer';
import { friendsReducers } from './friends.reducer';

export const appReducers: ActionReducerMap<IAppState> = {
  friend: friendsReducers,
  order: orderReducer,
  router: routerReducer,
  employees: employeesReducer,
  locations: tariffReducer,
  bigOrderTable: bigOrderTableReducer,
  ecoNewsState: EcoNewsReducer,
  ecoEventsState: EcoEventsReducer
};
