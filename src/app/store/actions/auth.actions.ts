import { ISignInResponse } from '@global-models/auth/sign-in-response.interface';
import { ISignIn } from '@global-models/auth/sign-in.interface';
import { createAction, props } from '@ngrx/store';

export enum AuthActions {
  SignIn = '[Auth] Sign In',
  SignInSuccess = '[Auth] Sign In Success',
  SignInFailure = '[Auth] Sign In Failure'
}

export const SignInAction = createAction(AuthActions.SignIn, props<{ data: ISignIn; isUBS: boolean }>());

export const SignInSuccessAction = createAction(AuthActions.SignInSuccess, props<{ data: ISignInResponse }>());

export const SignInFailureAction = createAction(AuthActions.SignInFailure, props<{ error: string }>());
