import { ShoppingList } from '@global-user/models/shoppinglist.model';

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
  shoppingListItems?: Array<ShoppingList>;
  tags: Array<string>;
}

export interface HabitTranslationInterface {
  description: string;
  habitItem: any;
  languageCode: string;
  name: string;
}

export interface HabitListInterface {
  currentPage: number;
  page: Array<HabitInterface>;
  totalElements: number;
  totalPages: number;
}
