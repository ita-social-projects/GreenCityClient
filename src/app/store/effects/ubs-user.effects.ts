import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GetUserBonuses, GetUserBonusesSuccess } from 'src/app/store/actions/ubs-user.actions';
import { BonusesService } from 'src/app/ubs/ubs-user/ubs-user-bonuses/services/bonuses.service';

@Injectable()
export class UbsUserEffects {
  constructor(
    private actions: Actions,
    private bonusesService: BonusesService
  ) {}

  getUserBonuses = createEffect(() => {
    return this.actions.pipe(
      ofType(GetUserBonuses),
      mergeMap(() => {
        return this.bonusesService.getUserBonuses().pipe(
          map((response) => GetUserBonusesSuccess({ points: response.points })),
          catchError(() => EMPTY)
        );
      })
    );
  });
}
