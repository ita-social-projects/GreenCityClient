import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { mergeMap, switchMap } from 'rxjs/operators';
import { Credentials } from './auth.actions';
import { of } from 'rxjs';
import { AuthService } from 'angularx-social-login';
import { UserOwnSignInService } from '../../../service/auth/user-own-sign-in.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userOwnAuthService: UserOwnSignInService
  ) {}

  @Effect()
  authSignIn = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGN_IN),
    switchMap((payload: Credentials) => {
      // TO DO
      return of(payload);
    }),
    mergeMap((userData?: any) => {
      // TO DO
      return [
        {
          action: AuthActions.SIGN_IN,
        },
        {
          action: AuthActions.SET_USER_DATA,
          payload: userData
        }
      ];
    })
  );

  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.TRY_SIGN_UP),
    switchMap((payload) => {
      // TO DO
      return of(payload);
    }),
    mergeMap(() => {
      // TO DO
      return [
        {
          action: AuthActions.SIGN_UP,
        }
      ];
    })
  );
}
