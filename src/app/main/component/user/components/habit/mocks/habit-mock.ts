import { HabitListInterface } from '../models/interfaces/habit.interface';
import { CUSTOMHABIT, DEFAULTHABIT } from './habit-assigned-mock';
import { HabitStatisticsDto } from '@global-models/habit/HabitStatisticsDto';
import { DayEstimation } from '@global-models/habit/DayEstimation';
import { AvailableHabitDto } from '@global-models/habit/AvailableHabitDto';
import { NewHabitDto } from '@global-models/habit/NewHabitDto';
import { HabitPageable } from '@global-user/components/habit/models/interfaces/custom-habit.interface';
import { CustomHabit } from '@global-user/components/habit/models/interfaces/custom-habit.interface';
import { CustomHabitDtoRequest } from '@global-user/components/habit/models/interfaces/custom-habit.interface';
import { TodoStatus } from '../models/todo-status.enum';

export const HABITLIST: HabitListInterface = {
  page: [DEFAULTHABIT, CUSTOMHABIT],
  totalElements: 31,
  currentPage: 1,
  totalPages: 2
};

export const HABIT_STATISTIC_DTO: HabitStatisticsDto = {
  id: 1,
  habitRate: DayEstimation.GOOD,
  createdOn: new Date(),
  amountOfItems: 1,
  habitId: 1
};

export const HABIT_STATISTICS: HabitStatisticsDto = {
  id: 2,
  habitRate: DayEstimation.NORMAL,
  createdOn: new Date(),
  amountOfItems: 2,
  habitId: 2
};

export const AVAIL_HABIT_ARRAY_MOCK: AvailableHabitDto[] = [
  {
    id: 1,
    name: 'availableHabit1',
    description: 'description1'
  },
  {
    id: 2,
    name: 'availableHabit2',
    description: 'description2'
  },
  {
    id: 3,
    name: 'availableHabit3',
    description: 'description3'
  }
];

export const MOCK_CUSTOM_HABIT: CustomHabit = {
  title: 'testTitle',
  description: 'testDescription',
  complexity: 1,
  duration: 30,
  tagIds: [1, 2],
  image: 'testImage',
  shopList: [
    {
      id: 2,
      text: 'Collapsible Silicone Water Bottle',
      status: TodoStatus.inprogress
    }
  ]
};

export const MOCK_CUSTOM_HABIT_RESPONSE: CustomHabitDtoRequest = {
  habitTranslations: [
    {
      name: MOCK_CUSTOM_HABIT.title,
      description: MOCK_CUSTOM_HABIT.description,
      habitItem: 'testHabitItem',
      languageCode: 'en',
      nameUa: MOCK_CUSTOM_HABIT.title,
      descriptionUa: MOCK_CUSTOM_HABIT.description,
      habitItemUa: 'testHabitItem'
    }
  ],
  complexity: MOCK_CUSTOM_HABIT.complexity,
  defaultDuration: MOCK_CUSTOM_HABIT.duration,
  image: MOCK_CUSTOM_HABIT.image,
  tagIds: MOCK_CUSTOM_HABIT.tagIds,
  customShoppingListItemDto: MOCK_CUSTOM_HABIT.shopList
};

export const NEW_HABIT_ARRAY_MOCK: NewHabitDto[] = [new NewHabitDto(1), new NewHabitDto(2), new NewHabitDto(3)];

export const CRITERIA_FILTER: HabitPageable = { page: 1, size: 10, lang: 'en', sort: 'asc', filters: ['filter1', 'filter2'] };

export const CRITERIA_TAGS: HabitPageable = { page: 1, size: 1, sort: 'asc', lang: 'en', excludeAssigned: false, tags: ['test'] };

export const CRITERIA: HabitPageable = { page: 1, size: 1, lang: 'en', sort: 'asc' };
