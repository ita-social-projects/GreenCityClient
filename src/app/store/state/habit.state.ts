import { HabitInterface } from '@global-user/components/habit/models/interfaces/habit.interface';

export const initialHabitState: HabitInterface = {
  defaultDuration: 7,
  habitTranslation: {
    description: '',
    habitItem: null,
    languageCode: '',
    name: '',
    nameUa: '',
    descriptionUa: '',
    habitItemUa: undefined
  },
  id: null,
  image: '',
  amountAcquiredUsers: null,
  isCustomHabit: null,
  usersIdWhoCreatedCustomHabit: null,
  tags: []
};
