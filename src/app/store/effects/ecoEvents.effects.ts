import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { EventPageResponceDto, EventResponseDto } from 'src/app/main/component/events/models/events.interface';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import {
  CreateEcoEventAction,
  CreateEcoEventSuccessAction,
  DeleteEcoEventAction,
  DeleteEcoEventSuccessAction,
  EditEcoEventAction,
  EditEcoEventSuccessAction,
  GetEcoEventsByPageAction,
  GetEcoEventsByPageSuccessAction,
  ReceivedFailure
} from '../actions/ecoEvents.actions';
import { IAppState } from '../state/app.state';
import { IEcoEventsState } from '../state/ecoEvents.state';

@Injectable()
export class EventsEffects {
  constructor(private actions: Actions, private eventsService: EventsService, private store: Store) {}

  getEcoEventsByPage = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEcoEventsByPageAction),
      mergeMap((actions: { currentPage: number; numberOfEvents: number }) => {
        let eventsListState: EventPageResponceDto[];
        this.store
          .select((state: IAppState): IEcoEventsState => state.ecoEventsState)
          .subscribe((res) => {
            eventsListState = res.eventsList[actions.currentPage];
          });
        if (!eventsListState) {
          return this.eventsService.getEvents(actions.currentPage, actions.numberOfEvents).pipe(
            map((ecoEvents: EventResponseDto) => GetEcoEventsByPageSuccessAction({ ecoEvents, currentPage: actions.currentPage })),
            catchError((error) => of(ReceivedFailure(error)))
          );
        } else {
          return of(GetEcoEventsByPageSuccessAction({ ecoEvents: false, currentPage: actions.currentPage }));
        }
      })
    );
  });

  createEvent = createEffect(() => {
    return this.actions.pipe(
      ofType(CreateEcoEventAction),
      mergeMap((actions: { data: FormData }) => {
        return this.eventsService.createEvent(actions.data).pipe(
          map((event: EventPageResponceDto) => CreateEcoEventSuccessAction({ event })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  editEvent = createEffect(() => {
    return this.actions.pipe(
      ofType(EditEcoEventAction),
      mergeMap((actions: { data: FormData }) => {
        return this.eventsService.editEvent(actions.data).pipe(
          map((event: EventPageResponceDto) => EditEcoEventSuccessAction({ event })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  deleteEvent = createEffect(() => {
    return this.actions.pipe(
      ofType(DeleteEcoEventAction),
      mergeMap((actions: { id: number }) => {
        return this.eventsService.deleteEvent(actions.id).pipe(
          map(() => DeleteEcoEventSuccessAction({ id: actions.id })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });
}
