import { Action } from '@ngrx/store';

export interface Credentials {
  login: string;
  password: string;
}

export const TRY_SIGN_IN = '[AUTH_MODULE] TRY_SIGN_IN';
export const LOGOUT = '[AUTH_MODULE] LOGOUT';
export const TRY_SIGN_UP = '[AUTH_MODULE] TRY_SIGN_UP';
export const SIGN_IN = '[AUTH_MODULE] SIGN_IN';
export const SIGN_UP = '[AUTH_MODULE] SIGN_UP';
export const SET_USER_DATA = '[AUTH_MODULE] SET_USER_DATA';

export class SetUserData implements Action {
  readonly type = SET_USER_DATA;

  constructor(public payload: any) {}
}

export class TrySignIn implements Action {
  readonly type = TRY_SIGN_IN;

  constructor(public payload: Credentials) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class TrySignUp implements Action {
  readonly type = TRY_SIGN_UP;

  constructor(public payload: any) {}
}

export class SignIn implements Action {
  readonly type = SIGN_IN;
}

export class SignUp implements Action {
  readonly type = SIGN_UP;
}

export type AuthActions =
  TrySignIn |
  Logout |
  TrySignUp |
  SignIn |
  SignUp |
  SetUserData;


