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
import { habitReducer } from './habit.reducer';
import { ubsUserReducer } from 'src/app/store/reducers/ubs-user.reducer';
import { authReducer } from 'src/app/store/reducers/auth.reducer';

export const appReducers: ActionReducerMap<IAppState> = {
  auth: authReducer,
  friend: friendsReducers,
  order: orderReducer,
  router: routerReducer,
  employees: employeesReducer,
  locations: tariffReducer,
  bigOrderTable: bigOrderTableReducer,
  ecoNewsState: EcoNewsReducer,
  ecoEventsState: EcoEventsReducer,
  habit: habitReducer,
  ubsUser: ubsUserReducer
};
