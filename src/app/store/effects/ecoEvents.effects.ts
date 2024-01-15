import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  EventFilterCriteriaInterface,
  EventPageResponseDto,
  EventResponseDto
} from 'src/app/main/component/events/models/events.interface';
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
  RateEcoEventsByIdAction,
  RateEcoEventsByIdSuccessAction,
  AddAttenderEcoEventsByIdAction,
  AddAttenderEventsByIdSuccessAction,
  RemoveAttenderEcoEventsByIdAction,
  RemoveAttenderEventsByIdSuccessAction,
  ReceivedFailureAction
} from '../actions/ecoEvents.actions';
import { IAppState } from '../state/app.state';
import { IEcoEventsState } from '../state/ecoEvents.state';

@Injectable()
export class EventsEffects {
  constructor(private actions: Actions, private eventsService: EventsService, private store: Store) {}

  getEcoEventsByPage = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEcoEventsByPageAction),
      mergeMap((actions: { currentPage: number; numberOfEvents: number; reset: boolean; filter: EventFilterCriteriaInterface }) => {
        return this.eventsService.getEvents(actions.currentPage, actions.numberOfEvents, actions.filter).pipe(
          map((ecoEvents: EventResponseDto) => GetEcoEventsByPageSuccessAction({ ecoEvents, reset: actions.reset })),
          catchError((error) => of(ReceivedFailureAction(error)))
        );
      })
    );
  });

  createEvent = createEffect(() => {
    return this.actions.pipe(
      ofType(CreateEcoEventAction),
      mergeMap((actions: { data: FormData }) => {
        return this.eventsService.createEvent(actions.data).pipe(
          map((event: EventPageResponseDto) => CreateEcoEventSuccessAction({ event })),
          catchError((error) => of(ReceivedFailureAction(error)))
        );
      })
    );
  });

  editEvent = createEffect(() => {
    return this.actions.pipe(
      ofType(EditEcoEventAction),
      mergeMap((actions: { data: FormData }) => {
        return this.eventsService.editEvent(actions.data).pipe(
          map((event: EventPageResponseDto) => EditEcoEventSuccessAction({ event })),
          catchError((error) => of(ReceivedFailureAction(error)))
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
          catchError((error) => of(ReceivedFailureAction(error)))
        );
      })
    );
  });

  rateEvent = createEffect(() => {
    return this.actions.pipe(
      ofType(RateEcoEventsByIdAction),
      mergeMap((actions: { id: number; grade: number }) => {
        return this.eventsService.rateEvent(actions.id, actions.grade).pipe(
          map(() => RateEcoEventsByIdSuccessAction({ id: actions.id, grade: actions.grade })),
          catchError((error) => of(ReceivedFailureAction(error)))
        );
      })
    );
  });
  AddAttender = createEffect(() => {
    return this.actions.pipe(
      ofType(AddAttenderEcoEventsByIdAction),
      mergeMap((actions: { id: number }) => {
        return this.eventsService.addAttender(actions.id).pipe(
          map(() => AddAttenderEventsByIdSuccessAction({ id: actions.id })),
          catchError((error) => of(ReceivedFailureAction(error)))
        );
      })
    );
  });

  RemoveAttender = createEffect(() => {
    return this.actions.pipe(
      ofType(RemoveAttenderEcoEventsByIdAction),
      mergeMap((actions: { id: number }) => {
        return this.eventsService.removeAttender(actions.id).pipe(
          map(() => RemoveAttenderEventsByIdSuccessAction({ id: actions.id })),
          catchError((error) => of(ReceivedFailureAction(error)))
        );
      })
    );
  });
}
