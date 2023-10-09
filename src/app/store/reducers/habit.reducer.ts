import { createReducer, on } from '@ngrx/store';
import { SetHabitForEdit } from '../actions/habit.actions';
import { initialHabitState } from '../state/habit.state';

export const habitReducer = createReducer(
  initialHabitState,

  on(SetHabitForEdit, (state, { habitResponse }) => ({
    ...state,
    ...habitResponse
  }))
);
