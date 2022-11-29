import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { EventParticipantDto } from './../../main/component/events/models/events.interface';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
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
  RateEcoEventsByIdAction,
  RateEcoEventsByIdSuccessAction,
  AddAttenderEcoEventsByIdAction,
  AddAttenderEventsByIdSuccessAction,
  RemoveAttenderEcoEventsByIdAction,
  RemoveAttenderEventsByIdSuccessAction,
  ReceivedFailureAction,
  ShowAllSubscribersByIdAction,
  ShowAllSubscribersByIdActionSuccess
} from '../actions/ecoEvents.actions';
import { IAppState } from '../state/app.state';

@Injectable()
export class EventsEffects {
  constructor(private actions: Actions, private eventsService: EventsService, private store: Store) {}

  getEcoEventsByPage = createEffect(() => {
    console.log('created GetEcoEventsByPageEffect');
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
            catchError((error) => of(ReceivedFailureAction(error)))
          );
        } else {
          return of(GetEcoEventsByPageSuccessAction({ ecoEvents: false, currentPage: actions.currentPage }));
        }
      })
    );
  });

  ShowAllSubscribersById = createEffect(() => {
    console.log('created ShowAllSubscribersByIdEffect');
    return this.actions.pipe(
      ofType(ShowAllSubscribersByIdAction),
      mergeMap((actions: { id: number }) => {
        let eventSubscriber: EventParticipantDto[];
        this.store
          .select((state: IAppState): IEcoEventsState => state.ecoEventsState)
          .subscribe((res) => {
            eventSubscriber = res.eventSubscribers[actions.id];
          });
        console.log(eventSubscriber);
        if (!eventSubscriber) {
          console.log(eventSubscriber);
          return this.eventsService.getAllSubscribers(actions.id).pipe(
            map((eventSubscribers: EventParticipantDto[]) => {
              console.log(eventSubscribers);
              return ShowAllSubscribersByIdActionSuccess({ id: actions.id, eventSubscribers });
            }),
            catchError((error) => of(ReceivedFailureAction(error)))
          );
        } else {
          return of(ShowAllSubscribersByIdActionSuccess({ id: actions.id, eventSubscribers: false }));
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
          map((event: EventPageResponceDto) => EditEcoEventSuccessAction({ event })),
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
