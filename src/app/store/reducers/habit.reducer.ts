import { createReducer, on } from '@ngrx/store';
import { AddHabitResponse } from '../actions/habit.actions';
import { initialHabitState } from '../state/habit.state';

export const habitReducer = createReducer(
  initialHabitState,

  on(AddHabitResponse, (state, { habitResponse }) => ({
    ...state,
    ...habitResponse
  }))
);
