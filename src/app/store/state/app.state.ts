import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { RouterReducerState } from '@ngrx/router-store';
import { IBigOrderTableState, initialBigOrderTableState } from './bigOrderTable.state';
import { IEmployeesState, initialEmployeesState } from './employee.state';
import { IEcoNewsState, initialNewsState } from './ecoNews.state';
import { ILocationsState, initialLocationsState } from './tariff.state';

export interface IAppState {
  employees: IEmployeesState;
  locations: ILocationsState;
  bigOrderTable: IBigOrderTableState;
  router?: RouterReducerState;
  ecoNewsState: IEcoNewsState;
}

export const initialAppState: IAppState = {
  employees: initialEmployeesState,
  locations: initialLocationsState,
  bigOrderTable: initialBigOrderTableState,
  ecoNewsState: initialNewsState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
