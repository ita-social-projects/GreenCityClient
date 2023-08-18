export interface HabitAssignCustomPropertiesDto {
  friendsIdsList: Array<number>;
  habitAssignPropertiesDto: HabitAssignPropertiesDto;
}

export interface HabitAssignPropertiesDto {
  defaultShoppingListItems: Array<number>;
  duration: number;
}
