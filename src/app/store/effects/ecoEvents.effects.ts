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
  GetEcoEventsByIdAction,
  GetEcoEventsByIdSuccessAction,
  RateEcoEventsByIdAction,
  RateEcoEventsByIdSuccessAction,
  AddAttenderEcoEventsByIdAction,
  AddAttenderEventsByIdSuccessAction,
  RemoveAttenderEcoEventsByIdAction,
  RemoveAttenderEventsByIdSuccessAction,
  ReceivedFailureAction
} from '../actions/ecoEvents.actions';

@Injectable()
export class EventsEffects {
  constructor(
    private actions: Actions,
    private eventsService: EventsService,
    private store: Store
  ) {}

  getEcoEventsById = createEffect(() =>
    this.actions.pipe(
      ofType(GetEcoEventsByIdAction),
      mergeMap((actions: { eventId: number; reset: boolean }) =>
        this.eventsService.getEventById(actions.eventId).pipe(
          map((ecoEvents: EventResponseDto) => GetEcoEventsByIdSuccessAction({ ecoEvents, reset: actions.reset })),
          catchError((error) => of(ReceivedFailureAction(error)))
        )
      )
    )
  );

  createEvent = createEffect(() =>
    this.actions.pipe(
      ofType(CreateEcoEventAction),
      mergeMap((actions: { data: FormData }) =>
        this.eventsService.createEvent(actions.data).pipe(
          map((event: EventPageResponseDto) => CreateEcoEventSuccessAction({ event })),
          catchError((error) => of(ReceivedFailureAction(error)))
        )
      )
    )
  );

  editEvent = createEffect(() =>
    this.actions.pipe(
      ofType(EditEcoEventAction),
      mergeMap((actions: { data: FormData }) =>
        this.eventsService.editEvent(actions.data).pipe(
          map((event: EventPageResponseDto) => EditEcoEventSuccessAction({ event })),
          catchError((error) => of(ReceivedFailureAction(error)))
        )
      )
    )
  );

  deleteEvent = createEffect(() =>
    this.actions.pipe(
      ofType(DeleteEcoEventAction),
      mergeMap((actions: { id: number }) =>
        this.eventsService.deleteEvent(actions.id).pipe(
          map(() => DeleteEcoEventSuccessAction({ id: actions.id })),
          catchError((error) => of(ReceivedFailureAction(error)))
        )
      )
    )
  );

  rateEvent = createEffect(() =>
    this.actions.pipe(
      ofType(RateEcoEventsByIdAction),
      mergeMap((actions: { id: number; grade: number }) =>
        this.eventsService.rateEvent(actions.id, actions.grade).pipe(
          map(() => RateEcoEventsByIdSuccessAction({ id: actions.id, grade: actions.grade })),
          catchError((error) => of(ReceivedFailureAction(error)))
        )
      )
    )
  );
  AddAttender = createEffect(() =>
    this.actions.pipe(
      ofType(AddAttenderEcoEventsByIdAction),
      mergeMap((actions: { id: number }) =>
        this.eventsService.addAttender(actions.id).pipe(
          map(() => AddAttenderEventsByIdSuccessAction({ id: actions.id })),
          catchError((error) => of(ReceivedFailureAction(error)))
        )
      )
    )
  );

  RemoveAttender = createEffect(() =>
    this.actions.pipe(
      ofType(RemoveAttenderEcoEventsByIdAction),
      mergeMap((actions: { id: number }) =>
        this.eventsService.removeAttender(actions.id).pipe(
          map(() => RemoveAttenderEventsByIdSuccessAction({ id: actions.id })),
          catchError((error) => of(ReceivedFailureAction(error)))
        )
      )
    )
  );
}
