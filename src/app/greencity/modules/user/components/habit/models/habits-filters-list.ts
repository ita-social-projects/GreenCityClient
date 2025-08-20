import { FilterSelect } from '@global-user/models/filter-select.interface';

export const HabitsFiltersList: FilterSelect[] = [
  {
    name: 'tags',
    title: 'user.habit.all-habits.filters.tags.title',
    selectAllOption: 'user.habit.all-habits.filters.tags.select-all',
    isAllSelected: false,
    options: []
  },
  {
    name: 'complexities',
    title: 'user.habit.all-habits.filters.complexities.title',
    selectAllOption: 'user.habit.all-habits.filters.complexities.select-all',
    isAllSelected: false,
    options: [
      { name: 'Easy', nameUk: 'Легка', value: '1', isActive: false },
      { name: 'Medium', nameUk: 'Середня', value: '2', isActive: false },
      { name: 'Hard', nameUk: 'Важка', value: '3', isActive: false }
    ]
  },
  {
    name: 'isCustomHabit',
    title: 'user.habit.all-habits.filters.is-custom.title',
    selectAllOption: 'user.habit.all-habits.filters.is-custom.select-all',
    isAllSelected: false,
    options: [
      { name: 'Default', nameUk: 'Стандартні', value: 'false', isActive: false },
      { name: 'Custom', nameUk: 'Створені', value: 'true', isActive: false }
    ]
  }
];
