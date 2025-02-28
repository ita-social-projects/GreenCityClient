import { CustomToDoItem } from 'src/app/greencity/modules/user/models/to-do-list.interface';

export interface HabitAssignCustomPropertiesDto {
  friendsIdsList: Array<number>;
  habitAssignPropertiesDto: HabitAssignPropertiesDto;
  customToDoListItemList: Array<CustomToDoItem>;
}

export interface HabitAssignPropertiesDto {
  defaultToDoListItems: Array<number>;
  duration: number;
  isPrivate: boolean;
}
