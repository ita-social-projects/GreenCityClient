import { ISignInResponse } from '@global-models/auth/sign-in-response.interface';
import { ISignIn } from '@global-models/auth/sign-in.interface';
import { createAction, props } from '@ngrx/store';

export enum AuthActions {
  GetCurrentUser = '[Auth] Get Current User',
  GetCurrentUserSuccess = '[Auth] Get Current User Success',
  GetCurrentUserFailure = '[Auth] Get Current User Failure',

  SignIn = '[Auth] Sign In',
  SignInWithGoogle = '[Auth] Sign In With Google',
  SignInSuccess = '[Auth] Sign In Success',
  SignInFailure = '[Auth] Sign In Failure',

  SignOutAction = '[Auth] Sign Out'
}

export const GetCurrentUserAction = createAction(AuthActions.GetCurrentUser);
export const GetCurrentUserSuccessAction = createAction(AuthActions.GetCurrentUserSuccess, props<{ data: ISignInResponse }>());
export const GetCurrentUserFailureAction = createAction(AuthActions.GetCurrentUserFailure);

export const SignInAction = createAction(AuthActions.SignIn, props<{ data: ISignIn; isUBS: boolean }>());
export const SignInWithGoogleAction = createAction(AuthActions.SignInWithGoogle, props<{ token: string; isUBS: boolean }>());
export const SignInSuccessAction = createAction(AuthActions.SignInSuccess, props<{ data: ISignInResponse }>());
export const SignInFailureAction = createAction(AuthActions.SignInFailure, props<{ error: string }>());

export const SignOutAction = createAction(AuthActions.SignOutAction);
