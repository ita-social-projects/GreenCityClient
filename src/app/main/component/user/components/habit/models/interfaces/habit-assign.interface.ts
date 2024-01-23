import { ShoppingList } from '../../../../models/shoppinglist.interface';
import { HabitInterface } from './habit.interface';

export interface HabitAssignInterface {
  id: number;
  status: 'SUSPENDED' | 'INPROGRESS' | 'ACQUIRED';
  createDateTime: Date;
  habit: HabitInterface;
  complexity?: number;
  enrolled?: boolean;
  userId: number;
  duration: number;
  defaultDuration?: number;
  workingDays: number;
  habitStreak: number;
  lastEnrollmentDate: Date;
  habitStatusCalendarDtoList: Array<HabitStatusCalendarListInterface>;
  shoppingListItems: Array<ShoppingList>;
  progressNotificationHasDisplayed?: boolean;
}

export interface HabitStatusCalendarListInterface {
  enrollDate: string;
  id: number;
}

export interface ResponseInterface {
  id: number;
  status: 'SUSPENDED' | 'INPROGRESS' | 'ACQUIRED';
  createDateTime: Date;
  habit: number;
  userId: number;
  duration: number;
  workingDays: number;
  habitStreak: number;
  lastEnrollmentDate: Date;
}
export interface ChangesFromCalendarToProgress {
  isEnrolled: boolean;
  date: string;
}
