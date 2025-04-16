import { HabitInterface } from 'src/app/greencity/modules/user/components/habit/models/interfaces/habit.interface';

export const initialHabitState: HabitInterface = {
  defaultDuration: 7,
  habitTranslation: {
    descriptionEn: '',
    habitItemEn: null,
    languageCode: '',
    nameEn: '',
    nameUk: '',
    descriptionUk: '',
    habitItemUk: undefined
  },
  id: null,
  image: '',
  amountAcquiredUsers: null,
  isCustomHabit: null,
  usersIdWhoCreatedCustomHabit: null,
  tags: []
};
