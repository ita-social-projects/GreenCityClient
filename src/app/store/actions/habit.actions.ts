import { createAction, props } from '@ngrx/store';
import { HabitInterface } from '@global-user/components/habit/models/interfaces/habit.interface';

export enum HabitActions {
  AddHabitResponse = '[Habit] Add Habit Response'
}

export const AddHabitResponse = createAction(HabitActions.AddHabitResponse, props<{ habitResponse: HabitInterface }>());
