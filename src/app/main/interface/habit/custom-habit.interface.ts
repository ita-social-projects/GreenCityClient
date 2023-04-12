import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { HabitTranslationInterface } from './habit.interface';

export interface CustomHabitInterface {
  id?: number;
  habitTranslations: HabitTranslationInterface[];
  complexity: number;
  defaultDuration: number;
  image: string;
  tagIds: number[];
  customShoppingListItemDto?: ShoppingList[];
  userId?: number;
}
