import { createAction, props } from '@ngrx/store';

export enum TariffActions {
  GetUserBonuses = '[UBS User] Get User Bonuses',
  GetUserBonusesSuccess = '[UBS User] Get User Bonuses Success',
  GetUserBonusesFailure = '[UBS User] Get User Bonuses Failure'
}

export const GetUserBonuses = createAction(TariffActions.GetUserBonuses);

export const GetUserBonusesSuccess = createAction(TariffActions.GetUserBonusesSuccess, props<{ points: number }>());

export const GetUserBonusesFailure = createAction(TariffActions.GetUserBonusesFailure);
