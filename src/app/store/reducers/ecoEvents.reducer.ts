import { createReducer, on } from '@ngrx/store';
import {
  AddAttenderEventsByIdSuccessAction,
  CreateEcoEventSuccessAction,
  DeleteEcoEventSuccessAction,
  EditEcoEventSuccessAction,
  GetEcoEventsByPageSuccessAction,
  GetEcoEventsByIdSuccessAction,
  RateEcoEventsByIdSuccessAction,
  ReceivedFailureAction,
  RemoveAttenderEventsByIdSuccessAction
} from '../actions/ecoEvents.actions';
import { initialEventsState } from '../state/ecoEvents.state';

export const EcoEventsReducer = createReducer(
  initialEventsState,
  on(GetEcoEventsByPageSuccessAction, (state, action) => {
    let prevList = state.eventsList;
    let prevNumber = state.pageNumber;
    if (action.reset) {
      prevList = [];
      prevNumber = 0;
    }
    return {
      ...state,
      eventsList: [...prevList, ...action.ecoEvents.page],
      eventState: { ...action.ecoEvents },
      pageNumber: prevNumber + 1
    };
  }),

  on(GetEcoEventsByIdSuccessAction, (state, action) => {
    let prevList = state.eventsList;
    if (action.reset) {
      prevList = [];
    }
    return {
      ...state,
      eventsList: [...prevList, action.ecoEvents]
    };
  }),

  on(EditEcoEventSuccessAction, (state, action) => {
    const newstate = state.eventsList.filter((it) => (it.id === action.event.id ? action.event : it));
    return {
      ...state,
      eventsList: newstate
    };
  }),

  on(CreateEcoEventSuccessAction, RateEcoEventsByIdSuccessAction, (state) => {
    return {
      ...state,
      eventsList: [],
      pageNumber: 0,
      visitedPages: [],
      totalPages: 0
    };
  }),
  on(DeleteEcoEventSuccessAction, (state, action) => {
    const prevList = state.eventsList;
    const newState = prevList.filter((event) => event.id !== action.id);
    return {
      ...state,
      eventsList: newState
    };
  }),

  on(AddAttenderEventsByIdSuccessAction, RemoveAttenderEventsByIdSuccessAction, (state, action) => {
    const newState = state.eventsList.map((val) => {
      if (action.id === val.id) {
        return val.isSubscribed ? { ...val, isSubscribed: false } : { ...val, isSubscribed: true };
      }
      return val;
    });
    return {
      ...state,
      eventsList: newState
    };
  }),

  on(ReceivedFailureAction, (state, action) => ({
    ...state,
    error: action.error
  }))
);
