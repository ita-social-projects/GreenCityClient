import { act } from '@ngrx/effects';
import { createReducer, on } from '@ngrx/store';
import { GetEcoEventsByPageSuccessAction } from '../actions/ecoEvents.actions';
import { initialEventsState } from '../state/ecoEvents.state';

export const EcoEventsReducer = createReducer(
  initialEventsState,
  on(GetEcoEventsByPageSuccessAction, (state, action) => {
    const newstate = [...state.eventsList];
    let pages = [...state.visitedPages];
    let totalPages = state.totalPages;
    if (action.ecoEvents) {
      newstate[action.ecoEvents.currentPage] = action.ecoEvents.page;
      pages = [...state.visitedPages, action.ecoEvents.currentPage];
      totalPages = action.ecoEvents.totalPages;
    }
    return {
      ...state,
      eventsList: newstate,
      eventState: action.ecoEvents,
      visitedPages: pages,
      totalPages: totalPages,
      pageNumber: action.currentPage
    };
  })
);
