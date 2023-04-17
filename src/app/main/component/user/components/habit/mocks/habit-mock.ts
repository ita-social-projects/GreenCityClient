import { HabitListInterface } from '../models/interfaces/habit.interface';
import { CUSTOMHABIT, DEFAULTHABIT } from './habit-assigned-mock';

export const HABITLIST: HabitListInterface = {
  page: [DEFAULTHABIT, CUSTOMHABIT],
  totalElements: 31,
  currentPage: 1,
  totalPages: 2
};
