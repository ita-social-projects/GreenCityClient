import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  GetLocations,
  GetLocationsSuccess,
  AddLocations,
  ReceivedFailure,
  UpdateLocationsSuccess,
  UpdateLocations
} from '../actions/tariff.actions';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';
import { CreateLocation, Locations } from 'src/app/ubs/ubs-admin/models/tariffs.interface';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class LocationsEffects {
  constructor(
    private actions: Actions,
    private tariffsService: TariffsService
  ) {}

  getLocations = createEffect(() =>
    this.actions.pipe(
      ofType(GetLocations),
      mergeMap((actions: { reset: boolean }) =>
        this.tariffsService.getLocations().pipe(
          map((locations: Locations[]) => GetLocationsSuccess({ locations, reset: actions.reset })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  addLocations = createEffect(() =>
    this.actions.pipe(
      ofType(AddLocations),
      mergeMap((action: { locations: CreateLocation[] }) =>
        this.tariffsService.addLocation(action.locations).pipe(
          switchMap((data: CreateLocation) =>
            this.tariffsService.getLocations().pipe(map((locations: Locations[]) => UpdateLocationsSuccess({ locations })))
          ),
          catchError((error) => of(ReceivedFailure(error)))
        )
      )
    )
  );

  updateLocations = createEffect(() =>
    this.actions.pipe(
      ofType(UpdateLocations),
      mergeMap(() =>
        this.tariffsService.getLocations().pipe(
          map((locations: Locations[]) => UpdateLocationsSuccess({ locations })),
          catchError((error) => of(ReceivedFailure(error)))
        )
      )
    )
  );
}
