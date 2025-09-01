import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AuthorityService } from '@ubs/ubs-admin/services/authority.service';
import { GetCategories, GetCategoriesSuccess, GetCategoriesFailure } from '../actions/authority.actions';

@Injectable()
export class AuthorityEffects {
  constructor(
    private readonly actions: Actions,
    private readonly authorityService: AuthorityService
  ) {}

  GetCategories = createEffect(() =>
    this.actions.pipe(
      ofType(GetCategories),
      mergeMap(() =>
        this.authorityService.getAllAuthorities().pipe(
          map((categories) => GetCategoriesSuccess({ categories })),
          catchError((error) => of(GetCategoriesFailure({ error })))
        )
      )
    )
  );
}
