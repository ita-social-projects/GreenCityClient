export class HabitAssignCustomPropertiesDto {
  friendsIdsList: Array<number>;
  habitAssignPropertiesDto: HabitAssignPropertiesDto;
}

export class HabitAssignPropertiesDto {
  defaultShoppingListItems: Array<number>;
  duration: number;
}
