import { CustomShoppingItem } from '@global-user/models/shoppinglist.interface';

export interface HabitAssignCustomPropertiesDto {
  friendsIdsList: Array<number>;
  habitAssignPropertiesDto: HabitAssignPropertiesDto;
  customShoppingListItemList: Array<CustomShoppingItem>;
}

export interface HabitAssignPropertiesDto {
  defaultShoppingListItems: Array<number>;
  duration: number;
}
