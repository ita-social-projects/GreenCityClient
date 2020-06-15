import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    // UserService should be implemented after appropriate service on the backend will be done
    // private userService: UserService
  ) {}

  @Effect()
  getUserData = this.actions$.pipe(
    ofType(UserActions.GET_USER_DATA),
    switchMap(() => {
      // return this.userService.getUserData();
      return of();
    }),
    mergeMap((userData?: Array<any>) => {
      return [
        {
          action: UserActions.SAVE_USER_DATA,
          payload: userData
        }
      ];
    })
  );

  @Effect()
  getHabitsList = this.actions$.pipe(
    ofType(UserActions.GET_HABITS_LIST),
    switchMap(() => {
      // return this.userService.getHabitsList();
      return of();
    }),
    mergeMap((habitsList?: Array<any>) => {
      return [
        {
          action: UserActions.SAVE_HABITS_LIST,
          payload: habitsList

        }
      ];
    })
  );

  @Effect()
  getCardsList = this.actions$.pipe(
    ofType(UserActions.GET_CARDS_LIST),
    switchMap(() => {
      return of();
    }),
    mergeMap((cardsList?: Array<any>) => {
      return [
        {
          action: UserActions.SAVE_CARDS_LIST,
          payload: cardsList
        }
      ];
    })
  );
}
