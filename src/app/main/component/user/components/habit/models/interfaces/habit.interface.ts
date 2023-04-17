import { ShoppingList } from '../../../../models/shoppinglist.interface';

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
  customShoppingListItems?: ShoppingList[];
  shoppingListItems?: ShoppingList[];
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
