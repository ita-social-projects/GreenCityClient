import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { routerReducer } from '@ngrx/router-store';
import { employeesReducer } from './employee.reducer';

export const appReducers: ActionReducerMap<IAppState> = {
  router: routerReducer,
  employees: employeesReducer
};
