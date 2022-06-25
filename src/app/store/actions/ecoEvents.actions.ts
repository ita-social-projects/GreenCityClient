import { createAction, props } from '@ngrx/store';
import { EventPageResponceDto, EventResponseDto } from 'src/app/main/component/events/models/events.interface';

export enum EventsActions {
  GetEcoEventsByPage = '[Events] Get events by page',
  GetEcoEventsByPageSuccess = '[Events] Get events by page Success',

  EditEcoEvent = '[Events] Edit event',
  EditEcoEventSuccess = '[Events] Edit event Success',

  CreateEcoEvent = '[Events] Create event',
  CreateEcoEventSuccess = '[Events] Create event Success',

  DeleteEcoEvent = '[Events] Delete event',
  DeleteEcoEventSuccess = '[Events] Delete event Success',

  ReceivedFailure = '[Events] Received Failure'
}

export const EditEcoEventAction = createAction(EventsActions.EditEcoEvent, props<{ data: FormData }>());
export const EditEcoEventSuccessAction = createAction(EventsActions.EditEcoEventSuccess, props<{ event: EventPageResponceDto }>());

export const CreateEcoEventAction = createAction(EventsActions.CreateEcoEvent, props<{ data: FormData }>());
export const CreateEcoEventSuccessAction = createAction(EventsActions.CreateEcoEventSuccess, props<{ event: EventPageResponceDto }>());

export const DeleteEcoEventAction = createAction(EventsActions.DeleteEcoEvent, props<{ id: number }>());
export const DeleteEcoEventSuccessAction = createAction(EventsActions.DeleteEcoEventSuccess, props<{ id: number }>());

export const GetEcoEventsByPageAction = createAction(
  EventsActions.GetEcoEventsByPage,
  props<{ currentPage: number; numberOfEvents: number }>()
);

export const GetEcoEventsByPageSuccessAction = createAction(
  EventsActions.GetEcoEventsByPageSuccess,
  props<{ ecoEvents: EventResponseDto | any; currentPage: number }>()
);

export const ReceivedFailure = createAction(EventsActions.ReceivedFailure, props<{ error: string | null }>());
