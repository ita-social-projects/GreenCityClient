import { ShoppingList } from '../../../../models/shoppinglist.interface';
import { HabitTranslationInterface } from './habit.interface';

export interface CustomHabitDtoRequest {
  habitTranslations: HabitTranslationInterface[];
  complexity: number;
  defaultDuration: number;
  image: string;
  tagIds: number[];
  customShoppingListItemDto: ShoppingList[];
}

export interface CustomHabit {
  title: string;
  description: string;
  complexity: number;
  duration: number;
  tagIds: number[];
  image: string;
  shopList: ShoppingList[];
}
