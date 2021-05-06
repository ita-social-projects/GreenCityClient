export interface HabitItemModel {
  id: number;
  dayCount: number;
  title: string;
  describe: string;
  done: boolean;
  acquired: boolean;
}

export class ServerHabitItemModel {
  totalPages: number;
  totalElements: number;
  page: ServerHabitItemPageModel[];
  currentPage: number;
}

export class ServerHabitItemPageModel {
  habitTranslation: {
    description: string;
    habitItem: string[];
    languageCode: string;
    name: string;
  };
  id: number;
  image: string;
  defaultDuration: number;
}
