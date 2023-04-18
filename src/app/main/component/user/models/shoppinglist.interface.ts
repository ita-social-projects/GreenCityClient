export interface ShoppingList {
  id: number;
  status: string;
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
