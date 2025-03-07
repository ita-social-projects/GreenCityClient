import { createAction, props } from '@ngrx/store';
import { HabitInterface } from 'src/app/greencity/modules/user/components/habit/models/interfaces/habit.interface';

export enum HabitActions {
  SetHabitForEdit = '[Habit] Set Habit For Edit'
}

export const SetHabitForEdit = createAction(HabitActions.SetHabitForEdit, props<{ habitResponse: HabitInterface }>());
