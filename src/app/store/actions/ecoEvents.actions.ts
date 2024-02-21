import { createAction, props } from '@ngrx/store';
import {
  EventFilterCriteriaInterface,
  EventPageResponseDto,
  EventResponseDto
} from 'src/app/main/component/events/models/events.interface';

export enum EventsActions {
  GetEcoEventsByPage = '[Events] Get events by page',
  GetEcoEventsByPageSuccess = '[Events] Get events by page Success',

  GetEcoEventsById = '[Events] Get events by ID',
  GetEcoEventsByIdSuccess = '[Events] Get events by ID Success',

  EditEcoEvent = '[Events] Edit event',
  EditEcoEventSuccess = '[Events] Edit event Success',

  CreateEcoEvent = '[Events] Create event',
  CreateEcoEventSuccess = '[Events] Create event Success',

  DeleteEcoEvent = '[Events] Delete event',
  DeleteEcoEventSuccess = '[Events] Delete event Success',

  RateEcoEventsById = '[Events] Rate events by id',
  RateEcoEventsByIdSuccess = '[Events] Rate event Success',

  AddAttenderEcoEventsById = '[Events] Add attender to event by id',
  AddAttenderEcoEventsByIdSuccess = '[Events] Add attender to event Success',

  RemoveAttenderEcoEventsById = '[Events] Remove attender to event by id',
  RemoveAttenderEcoEventsByIdSuccess = '[Events] Remove attender to event Success',

  ReceivedFailure = '[Events] Received Failure'
}

export const EditEcoEventAction = createAction(EventsActions.EditEcoEvent, props<{ data: FormData }>());
export const EditEcoEventSuccessAction = createAction(EventsActions.EditEcoEventSuccess, props<{ event: EventPageResponseDto }>());

export const CreateEcoEventAction = createAction(EventsActions.CreateEcoEvent, props<{ data: FormData }>());
export const CreateEcoEventSuccessAction = createAction(EventsActions.CreateEcoEventSuccess, props<{ event: EventPageResponseDto }>());

export const DeleteEcoEventAction = createAction(EventsActions.DeleteEcoEvent, props<{ id: number }>());
export const DeleteEcoEventSuccessAction = createAction(EventsActions.DeleteEcoEventSuccess, props<{ id: number }>());

export const GetEcoEventsByPageAction = createAction(
  EventsActions.GetEcoEventsByPage,
  props<{ currentPage: number; numberOfEvents: number; reset: boolean; filter: EventFilterCriteriaInterface }>()
);

export const GetEcoEventsByPageSuccessAction = createAction(
  EventsActions.GetEcoEventsByPageSuccess,
  props<{ ecoEvents: EventResponseDto; reset: boolean }>()
);

export const GetEcoEventsByIdAction = createAction(EventsActions.GetEcoEventsById, props<{ eventId: number; reset: boolean }>());

export const GetEcoEventsByIdSuccessAction = createAction(
  EventsActions.GetEcoEventsByIdSuccess,
  props<{ ecoEvents: EventResponseDto; reset: boolean }>()
);

export const RateEcoEventsByIdAction = createAction(EventsActions.RateEcoEventsById, props<{ id: number; grade: number }>());
export const RateEcoEventsByIdSuccessAction = createAction(EventsActions.RateEcoEventsByIdSuccess, props<{ id: number; grade: number }>());

export const AddAttenderEcoEventsByIdAction = createAction(EventsActions.AddAttenderEcoEventsById, props<{ id: number }>());
export const AddAttenderEventsByIdSuccessAction = createAction(EventsActions.AddAttenderEcoEventsByIdSuccess, props<{ id: number }>());

export const RemoveAttenderEcoEventsByIdAction = createAction(EventsActions.RemoveAttenderEcoEventsById, props<{ id: number }>());
export const RemoveAttenderEventsByIdSuccessAction = createAction(
  EventsActions.RemoveAttenderEcoEventsByIdSuccess,
  props<{ id: number }>()
);

export const ReceivedFailureAction = createAction(EventsActions.ReceivedFailure, props<{ error: string | null }>());
