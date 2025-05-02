import { ToDoList } from 'src/app/greencity/modules/user/models/to-do-list.interface';

export interface HabitInterface {
  defaultDuration: number;
  habitTranslation: HabitTranslationInterface;
  id: number;
  image: string;
  isAssigned?: boolean;
  assignId?: number;
  complexity?: number;
  amountAcquiredUsers: number;
  habitAssignStatus?: string;
  isCustomHabit: boolean;
  usersIdWhoCreatedCustomHabit: number;
  customToDoListItems?: ToDoList[];
  toDoListItems?: ToDoList[];
  tags: Array<string>;
  duration?: number;
}

export interface HabitTranslationInterface {
  description: string;
  habitItem: string;
  languageCode: string;
  name: string;
}

export interface HabitListInterface {
  currentPage: number;
  page: Array<HabitInterface>;
  totalElements: number;
  totalPages: number;
}
