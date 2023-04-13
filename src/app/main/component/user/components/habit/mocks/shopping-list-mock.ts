import { ShoppingList } from '@global-user/models/shoppinglist.model';

export const SHOPLISTITEMONE: ShoppingList = {
  id: 1,
  text: 'Reusable stainless steel water bottle',
  status: 'ACTIVE'
};

export const SHOPLISTITEMTWO: ShoppingList = {
  id: 2,
  text: 'Collapsible Silicone Water Bottle',
  status: 'INPROGRESS'
};

export const SHOPLIST: ShoppingList[] = [SHOPLISTITEMONE, SHOPLISTITEMTWO];
