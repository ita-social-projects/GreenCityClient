import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { HabitTranslationInterface } from './habit.interface';

export interface CustomHabitInterface {
  habitTranslations: HabitTranslationInterface[];
  complexity: number;
  defaultDuration: number;
  image: string;
  tags: string;
  customShoppingListItemDto?: ShoppingList[];
}
