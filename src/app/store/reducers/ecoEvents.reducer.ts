import { createReducer, on } from '@ngrx/store';
import {
  AddAttenderEventsByIdSuccessAction,
  CreateEcoEventSuccessAction,
  DeleteEcoEventSuccessAction,
  EditEcoEventSuccessAction,
  GetEcoEventsByPageSuccessAction,
  RateEcoEventsByIdSuccessAction,
  ReceivedFailureAction,
  RemoveAttenderEventsByIdSuccessAction,
  ShowAllSubscribersByIdActionSuccess
} from '../actions/ecoEvents.actions';
import { initialEventsState } from '../state/ecoEvents.state';

export const EcoEventsReducer = createReducer(
  initialEventsState,
  on(GetEcoEventsByPageSuccessAction, (state, action) => {
    const newstate = [...state.eventsList];
    let pages = [...state.visitedPages];
    let totPages = state.totalPages;
    if (action.ecoEvents) {
      newstate[action.ecoEvents.currentPage] = action.ecoEvents.page;
      pages = [...state.visitedPages, action.ecoEvents.currentPage];
      totPages = action.ecoEvents.totalPages;
    }
    console.log({
      ...state,
      eventsList: newstate,
      eventState: action.ecoEvents,
      visitedPages: pages,
      totalPages: totPages,
      pageNumber: action.currentPage
    });
    return {
      ...state,
      eventsList: newstate,
      eventState: action.ecoEvents,
      visitedPages: pages,
      totalPages: totPages,
      pageNumber: action.currentPage
    };
  }),

  on(ShowAllSubscribersByIdActionSuccess, (state, action) => {
    state[action.id] = action.eventSubscribers;
    console.log({ ...state });
    return {
      ...state
    };
  }),

  on(EditEcoEventSuccessAction, (state, action) => {
    const newstate = state.eventsList.reduce((ac, cur, ind) => {
      const newItem = cur.map((item) => (item.id === action.event.id ? action.event : item));
      ac[ind] = newItem;
      return ac;
    }, []);
    return {
      ...state,
      eventsList: newstate
    };
  }),

  on(
    DeleteEcoEventSuccessAction,
    CreateEcoEventSuccessAction,
    AddAttenderEventsByIdSuccessAction,
    RemoveAttenderEventsByIdSuccessAction,
    RateEcoEventsByIdSuccessAction,
    (state) => {
      return {
        ...state,
        eventsList: [],
        pageNumber: 0,
        visitedPages: [],
        totalPages: 0
      };
    }
  ),

  on(ReceivedFailureAction, (state, action) => ({
    ...state,
    error: action.error
  }))
);
