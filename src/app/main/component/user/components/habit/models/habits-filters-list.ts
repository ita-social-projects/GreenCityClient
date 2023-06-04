import { FilterSelect } from '../../../../../interface/filter-select.interface';

export const HabitsFiltersList: FilterSelect[] = [
  {
    filter: 'tags',
    title: 'user.habit.all-habits.filters.tags.title',
    selectAllOption: 'user.habit.all-habits.filters.tags.select-all',
    options: []
  },
  {
    filter: 'complexities',
    title: 'user.habit.all-habits.filters.complexities.title',
    selectAllOption: 'user.habit.all-habits.filters.complexities.select-all',
    options: [
      { name: 'Easy', nameUa: 'Легка', value: '1', isActive: false },
      { name: 'Medium', nameUa: 'Середня', value: '2', isActive: false },
      { name: 'Hard', nameUa: 'Важка', value: '3', isActive: false }
    ]
  },
  {
    filter: 'isCustomHabit',
    title: 'user.habit.all-habits.filters.is-custom.title',
    selectAllOption: 'user.habit.all-habits.filters.is-custom.select-all',
    options: [
      { name: 'Default', nameUa: 'Стандартні', value: 'false', isActive: false },
      { name: 'Custom', nameUa: 'Створені', value: 'true', isActive: false }
    ]
  },
  {
    filter: 'isAssigned',
    title: 'user.habit.all-habits.filters.assign.title',
    selectAllOption: 'user.habit.all-habits.filters.assign.select-all',
    options: [
      { name: 'Inprogress', nameUa: 'У процесі', value: 'true', isActive: false },
      { name: 'Not inprogress', nameUa: 'Не у процесі', value: 'false', isActive: false }
    ]
  }
];
