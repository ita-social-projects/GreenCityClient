import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  GetLocations,
  GetLocationsSuccess,
  AddLocations,
  AddLocationsSuccess,
  ReceivedFailure,
  EditLocation,
  EditLocationSuccess
} from '../actions/tariff.actions';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';
import { CreateLocation, Locations, EditLocationName } from 'src/app/ubs/ubs-admin/models/tariffs.interface';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class LocationsEffects {
  constructor(private actions: Actions, private tariffsService: TariffsService) {}

  getLocations = createEffect(() => {
    return this.actions.pipe(
      ofType(GetLocations),
      mergeMap((actions: { reset: boolean }) => {
        return this.tariffsService.getLocations().pipe(
          map((locations: Locations[]) => GetLocationsSuccess({ locations, reset: actions.reset })),
          catchError(() => EMPTY)
        );
      })
    );
  });

  addLocations = createEffect(() => {
    return this.actions.pipe(
      ofType(AddLocations),
      mergeMap((action: { locations: CreateLocation[] }) => {
        return this.tariffsService.addLocation(action.locations).pipe(
          map((data: CreateLocation) => {
            const locations = JSON.parse(JSON.stringify(action.locations));
            return AddLocationsSuccess({ locations });
          }),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  editLocationName = createEffect(() => {
    return this.actions.pipe(
      ofType(EditLocation),
      mergeMap((action: { editedLocations: EditLocationName[]; regionId: number }) => {
        return this.tariffsService.editLocationName(action.regionId, action.editedLocations).pipe(
          map(() => {
            const editedLocations = JSON.parse(JSON.stringify(action.editedLocations));
            return EditLocationSuccess({ editedLocations, regionId: action.regionId });
          }),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });
}
