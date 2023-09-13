export enum ItemTime {
  START = '00 : 00',
  END = '23 : 59'
}

export interface OptionItem {
  nameEn: string;
  nameUa: string;
}

export interface AllSelectedFlags {
  tags: boolean;
  eventTime: boolean;
  statuses: boolean;
  cities: boolean;
}

export const allSelectedFlags = {
  eventTime: false,
  statuses: false,
  tags: false,
  cities: false
};

export const allSelectedFilter = {
  eventTime: { nameEn: 'Any time', nameUa: 'Будь-який час' },
  cities: { nameEn: 'All cites', nameUa: 'Всі міста' },
  statuses: { nameEn: 'Any status', nameUa: 'Будь-який статус' },
  tags: { nameEn: 'All types', nameUa: 'Всі типи' }
};

export const TagsArray = [
  { nameEn: 'Economic', nameUa: 'Економічний', isActive: false },
  { nameEn: 'Social', nameUa: 'Соціальний', isActive: false },
  { nameEn: 'Environmental', nameUa: 'Екологічний', isActive: false }
];

export const eventTimeList = [
  { nameEn: 'Future', nameUa: 'Майбутній' },
  { nameEn: 'Past', nameUa: 'Завершений' }
];

export const eventStatusList = [
  { nameEn: 'Open', nameUa: 'Відкритa' },
  { nameEn: 'Closed', nameUa: 'Закритa' },
  { nameEn: 'Joined', nameUa: 'Вже доєднані' },
  { nameEn: 'Created', nameUa: 'Створенa' },
  { nameEn: 'Saved', nameUa: 'Збережена' }
];

export const DateObj = {
  date: null,
  startDate: '',
  finishDate: '',
  coordinatesDto: {
    latitude: null,
    longitude: null
  },
  onlineLink: '',
  valid: false,
  check: false
};

export const WeekArray = [
  { nameEn: '1 day', nameUa: '1 день' },
  { nameEn: '2 days', nameUa: '2 дні' },
  { nameEn: '3 days', nameUa: '3 дні' },
  { nameEn: '4 days', nameUa: '4 дні' },
  { nameEn: '5 days', nameUa: '5 днів' },
  { nameEn: '6 days', nameUa: '6 днів' },
  { nameEn: '7 days', nameUa: '7 днів' }
];

export let EventFilterCriteria = {
  eventTime: [],
  cities: [],
  statuses: [],
  tags: []
};
