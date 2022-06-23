import { createAction, props } from '@ngrx/store';
import { EventResponseDto } from 'src/app/main/component/events/models/events.interface';

export enum EventsActions {
  GetEcoEventsByPage = '[Events] Get events by page',
  GetEcoEventsByPageSuccess = '[Events] Get events by page Success',

  EditEcoEvent = '[Events] Edit event',
  EditEcoEventSuccess = '[Events] Edit event Success',

  DeleteEcoEvent = '[Events] Delete event',
  DeleteEcoEventSuccess = '[Events] Delete event Success'
}

export const DeleteEcoNewsAction = createAction(EventsActions.DeleteEcoEvent, props<{ id: number }>());
export const DeleteEcoNewsSuccessAction = createAction(EventsActions.DeleteEcoEventSuccess);

export const GetEcoEventsByPageAction = createAction(
  EventsActions.GetEcoEventsByPage,
  props<{ currentPage: number; numberOfEvents: number; reset: boolean }>()
);

export const GetEcoEventsByPageSuccessAction = createAction(
  EventsActions.GetEcoEventsByPageSuccess,
  props<{ ecoEvents: EventResponseDto | any; currentPage: number; reset: boolean }>()
);
