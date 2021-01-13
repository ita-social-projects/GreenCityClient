export interface HabitInterface {
  defaultDuration: number;
  habitTranslation: HabitTranslationInterface;
  id: number;
  image: string;
  tags: Array<string>;
}

export interface HabitTranslationInterface {
  description: string;
  habitItem: any;
  languageCode: string;
  name: string;
}

export interface HabitShoppingListInterface {
  id: number;
  text: string;
}

export interface HabitListInterface {
  currentPage: number;
  page: Array<HabitInterface>;
  totalElements: number;
  totalPages: number;
}
