import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ISignInResponse } from '@global-models/auth/sign-in-response.interface';
import { ISignIn } from '@global-models/auth/sign-in.interface';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  GetCurrentUserAction,
  GetCurrentUserFailureAction,
  GetCurrentUserSuccessAction,
  SignInAction,
  SignInFailureAction,
  SignInSuccessAction,
  SignInWithGoogleAction
} from 'src/app/store/actions/auth.actions';
import { isUBSSelector, userRoleSelector } from 'src/app/store/selectors/auth.selectors';
import { IAppState } from 'src/app/store/state/app.state';

@Injectable()
export class AuthEffects {
  private readonly BACKEND_ERRORS = {
    Unauthorized: 'user.auth.sign-in.bad-email-or-password',
    'You should verify the email first, check your email box!': 'user.auth.sign-in.not-verified-email'
  };

  private actions: Actions = inject(Actions);
  private router: Router = inject(Router);
  private store: Store<IAppState> = inject(Store);
  private authService: AuthService = inject(AuthService);
  private jwtService: JwtService = inject(JwtService);

  $getCurrentUser = createEffect(() => {
    return this.actions.pipe(
      ofType(GetCurrentUserAction),
      mergeMap(() => {
        return this.authService.getCurrentUser().pipe(
          map((response: ISignInResponse) => (response ? GetCurrentUserSuccessAction({ data: response }) : GetCurrentUserFailureAction())),
          catchError(() => of(GetCurrentUserFailureAction()))
        );
      })
    );
  });

  $signIn = createEffect(() => {
    return this.actions.pipe(
      ofType(SignInAction),
      mergeMap((action: { data: ISignIn }) => {
        return this.authService.signIn(action.data).pipe(
          map((response: ISignInResponse) => SignInSuccessAction({ data: response })),
          catchError(() => of(SignInFailureAction({ error: this.BACKEND_ERRORS.Unauthorized })))
        );
      })
    );
  });

  $signInWithGoogle = createEffect(() => {
    return this.actions.pipe(
      ofType(SignInWithGoogleAction),
      mergeMap((action: { token: string }) => {
        return this.authService.signInWithGoogle(action.token).pipe(
          map((response: ISignInResponse) => SignInSuccessAction({ data: response })),
          catchError((error) => of(SignInFailureAction({ error: this.BACKEND_ERRORS[error.message] })))
        );
      })
    );
  });

  $redirectOnSuccess = createEffect(
    () => {
      return this.actions.pipe(
        ofType(SignInSuccessAction),
        withLatestFrom(this.store.select(userRoleSelector), this.store.select(isUBSSelector)),
        tap(([action, role, isUBS]) => {
          let redirectUrl = [];

          if (role === 'ROLE_UBS_EMPLOYEE') {
            redirectUrl = ['ubs-admin', 'orders'];
          } else {
            redirectUrl = isUBS ? ['ubs'] : ['profile', action.data.userId];
          }

          this.router.navigate(redirectUrl ?? ['ubs']);
        })
      );
    },
    { dispatch: false }
  );

  $saveDataToLocalStorage = createEffect(
    () => {
      return this.actions.pipe(
        ofType(SignInSuccessAction),
        tap((action) => {
          this.authService.saveDataToLocalStorage(action.data);
          this.jwtService.userRole$.next(action.data.userRole);
        })
      );
    },
    { dispatch: false }
  );
}
