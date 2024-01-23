import { TodoStatus } from '@global-user/components/habit/models/todo-status.enum';

export interface ShoppingList {
  id: null | number;
  status: TodoStatus;
  text: string;
  selected?: boolean;
  custom?: boolean;
}

export interface AllShoppingLists {
  userShoppingListItemDto: ShoppingList[];
  customShoppingListItemDto: ShoppingList[];
}

export interface CustomShoppingItem {
  text: string;
}

export interface HabitUpdateShopList {
  habitAssignId: number;
  standartShopList: ShoppingList[];
  customShopList: ShoppingList[];
  lang: string;
}
