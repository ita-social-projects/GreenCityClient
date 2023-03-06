import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { HabitInterface, HabitTranslationInterface } from './habit.interface';

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
}

export interface HabitResponseInterface {
  complexity: number;
  defaultDuration: number;
  habitTranslation: HabitTranslationInterface;
  id: number;
  image: string;
  shoppingListItems: Array<ShoppingList>;
  tags: Array<string>;
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
