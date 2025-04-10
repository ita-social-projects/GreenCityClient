import { AllToDoLists, CustomToDoItem, HabitUpdateToDoList, ToDoList } from 'src/app/greencity/modules/user/models/to-do-list.interface';
import { TodoStatus } from '../models/todo-status.enum';
import { HabitListInterface } from 'src/app/greencity/modules/user/components/habit/models/interfaces/habit.interface';
import {
  CustomHabit,
  CustomHabitDtoRequest
} from 'src/app/greencity/modules/user/components/habit/models/interfaces/custom-habit.interface';
import { FriendProfilePicturesArrayModel } from 'src/app/greencity/modules/user/models/friend.model';

export const TODOLISTITEMONE: ToDoList = {
  id: 1,
  text: 'Reusable stainless steel water bottle',
  status: TodoStatus.active
};

export const TODOLISTITEMTWO: ToDoList = {
  id: 2,
  text: 'Collapsible Silicone Water Bottle',
  status: TodoStatus.inprogress
};

export const TODOLIST: ToDoList[] = [TODOLISTITEMONE, TODOLISTITEMTWO];

export const ALLUSERTODOLISTS: AllToDoLists = {
  userToDoListItemDto: [TODOLISTITEMONE],
  customToDoListItemDto: [TODOLISTITEMTWO]
};

export const UPDATEHABITTODOLIST: HabitUpdateToDoList = {
  habitAssignId: 2,
  standardToDoList: [TODOLISTITEMONE],
  customToDoList: [TODOLISTITEMTWO],
  lang: 'ua'
};

export const CUSTOMTODOITEM: CustomToDoItem = {
  text: 'New item'
};

export const MOCK_HABITS: HabitListInterface = {
  currentPage: 1,
  page: [
    {
      defaultDuration: 30,
      habitTranslation: {
        nameEn: 'testName',
        descriptionEn: 'testDescription',
        habitItemEn: 'testHabitItem',
        languageCode: 'testLanguageCode',
        nameUk: '',
        descriptionUk: '',
        habitItemUk: 'testHabitItem'
      },
      id: 1,
      image: 'testImage',
      isAssigned: true,
      assignId: 1,
      complexity: 1,
      amountAcquiredUsers: 1,
      habitAssignStatus: 'testStatus',
      isCustomHabit: true,
      usersIdWhoCreatedCustomHabit: 1,
      customToDoListItems: [],
      toDoListItems: [],
      tags: ['tag1', 'tag2']
    }
  ],
  totalElements: 1,
  totalPages: 1
};

export const MOCK_CUSTOM_HABIT: CustomHabit = {
  title: 'testTitle',
  description: 'testDescription',
  complexity: 1,
  duration: 30,
  tagIds: [1, 2],
  image: 'testImage',
  toDoList: ALLUSERTODOLISTS.customToDoListItemDto
};

export const MOCK_CUSTOM_HABIT_RESPONSE: CustomHabitDtoRequest = {
  habitTranslations: [
    {
      nameEn: MOCK_CUSTOM_HABIT.title,
      descriptionEn: MOCK_CUSTOM_HABIT.description,
      habitItemEn: 'testHabitItem',
      languageCode: 'en',
      nameUk: MOCK_CUSTOM_HABIT.title,
      descriptionUk: MOCK_CUSTOM_HABIT.description,
      habitItemUk: 'testHabitItem'
    }
  ],
  complexity: MOCK_CUSTOM_HABIT.complexity,
  defaultDuration: MOCK_CUSTOM_HABIT.duration,
  image: MOCK_CUSTOM_HABIT.image,
  tagIds: MOCK_CUSTOM_HABIT.tagIds,
  customToDoListItemDto: MOCK_CUSTOM_HABIT.toDoList
};

export const MOCK_FRIEND_PROFILE_PICTURES: FriendProfilePicturesArrayModel[] = [
  {
    id: 1,
    name: 'testName',
    profilePicturePath: 'testProfilePicturePath'
  }
];
