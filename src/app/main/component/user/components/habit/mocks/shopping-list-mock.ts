import { AllShoppingLists, CustomShoppingItem, HabitUpdateShopList, ShoppingList } from '../../../models/shoppinglist.interface';
import { TodoStatus } from '../models/todo-status.enum';

export const SHOPLISTITEMONE: ShoppingList = {
  id: 1,
  text: 'Reusable stainless steel water bottle',
  status: TodoStatus.active
};

export const SHOPLISTITEMTWO: ShoppingList = {
  id: 2,
  text: 'Collapsible Silicone Water Bottle',
  status: TodoStatus.active
};

export const SHOPLIST: ShoppingList[] = [SHOPLISTITEMONE, SHOPLISTITEMTWO];

export const ALLUSERSHOPLISTS: AllShoppingLists = {
  userShoppingListItemDto: [SHOPLISTITEMONE],
  customShoppingListItemDto: [SHOPLISTITEMTWO]
};

export const UPDATEHABITSHOPLIST: HabitUpdateShopList = {
  habitAssignId: 2,
  standartShopList: [SHOPLISTITEMONE],
  customShopList: [SHOPLISTITEMTWO],
  lang: 'ua'
};

export const CUSTOMSHOPITEM: CustomShoppingItem = {
  text: 'New item'
};
