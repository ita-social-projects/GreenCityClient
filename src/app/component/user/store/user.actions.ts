import { Action } from '@ngrx/store';

export const GET_USER_DATA = '[USER_MODULE] GET_USER_DATA';
export const SAVE_USER_DATA = '[USER_MODULE] SAVE_USER_DATA';
export const GET_HABITS_LIST = '[USER_MODULE] GET_HABITS_LIST';
export const SAVE_HABITS_LIST = '[USER_MODULE] SAVE_HABITS_LIST';
export const GET_CARDS_LIST = '[USER_MODULE] GET_CARDS_lIST';
export const SAVE_CARDS_LIST = '[USER_MODULE] SAVE_CARDS_LIST';

export class GetUserData implements Action {
  readonly type = GET_USER_DATA;
}

export class SaveUserData implements Action {
  readonly type = SAVE_USER_DATA;

  // Appropriate interface should be created and replace 'any'
  constructor(public payload: any) {}
}

export class GetHabitsList implements Action {
  readonly type = GET_HABITS_LIST;
}

export class SaveHabitsList implements Action {
  readonly type = SAVE_HABITS_LIST;

  // Appropriate interface should be created and replace 'any'
  constructor(public habitsList: Array<any>) {}
}

export class GetCardsList implements Action {
  readonly type = GET_CARDS_LIST;
}

export class SaveCardsList implements Action {
  readonly type = SAVE_CARDS_LIST;

  // Appropriate interface should be created and replace 'any'
  constructor(public cardsList: Array<any>) {}
}

export type UserActions =
  GetUserData |
  SaveUserData |
  GetHabitsList |
  SaveHabitsList |
  GetCardsList |
  SaveCardsList;
