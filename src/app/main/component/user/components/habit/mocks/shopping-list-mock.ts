import { AllShoppingLists, CustomShoppingItem, HabitUpdateShopList, ShoppingList } from '@user-models/shoppinglist.interface';
import { TodoStatus } from '../models/todo-status.enum';
import { HabitListInterface } from '@global-user/components/habit/models/interfaces/habit.interface';
import { CustomHabit, CustomHabitDtoRequest } from '@global-user/components/habit/models/interfaces/custom-habit.interface';
import { FriendProfilePicturesArrayModel } from '@user-models/friend.model';

export const SHOPLISTITEMONE: ShoppingList = {
  id: 1,
  text: 'Reusable stainless steel water bottle',
  status: TodoStatus.active
};

export const SHOPLISTITEMTWO: ShoppingList = {
  id: 2,
  text: 'Collapsible Silicone Water Bottle',
  status: TodoStatus.inprogress
};

export const SHOPLIST: ShoppingList[] = [SHOPLISTITEMONE, SHOPLISTITEMTWO];

export const ALLUSERSHOPLISTS: AllShoppingLists = {
  userShoppingListItemDto: [SHOPLISTITEMONE],
  customShoppingListItemDto: [SHOPLISTITEMTWO]
};

export const UPDATEHABITSHOPLIST: HabitUpdateShopList = {
  habitAssignId: 2,
  standardShopList: [SHOPLISTITEMONE],
  customShopList: [SHOPLISTITEMTWO],
  lang: 'ua'
};

export const CUSTOMSHOPITEM: CustomShoppingItem = {
  text: 'New item'
};

export const MOCK_HABITS: HabitListInterface = {
  currentPage: 1,
  page: [
    {
      defaultDuration: 30,
      habitTranslation: {
        name: 'testName',
        description: 'testDescription',
        habitItem: 'testHabitItem',
        languageCode: 'testLanguageCode'
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
      customShoppingListItems: [],
      shoppingListItems: [],
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
  shopList: ALLUSERSHOPLISTS.customShoppingListItemDto
};

export const MOCK_CUSTOM_HABIT_RESPONSE: CustomHabitDtoRequest = {
  habitTranslations: [
    {
      name: MOCK_CUSTOM_HABIT.title,
      description: MOCK_CUSTOM_HABIT.description,
      habitItem: 'testHabitItem',
      languageCode: 'en'
    }
  ],
  complexity: MOCK_CUSTOM_HABIT.complexity,
  defaultDuration: MOCK_CUSTOM_HABIT.duration,
  image: MOCK_CUSTOM_HABIT.image,
  tagIds: MOCK_CUSTOM_HABIT.tagIds,
  customShoppingListItemDto: MOCK_CUSTOM_HABIT.shopList
};

export const MOCK_FRIEND_PROFILE_PICTURES: FriendProfilePicturesArrayModel[] = [
  {
    id: 1,
    name: 'testName',
    profilePicturePath: 'testProfilePicturePath'
  }
];
