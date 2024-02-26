import { FilterItem } from './events.interface';

export enum TimeBack {
  START = '00:00',
  END = '23:59'
}

export enum TimeFront {
  START = '0:00',
  END = '23:59',
  DIVIDER = ':',
  MINUTES = '00'
}

export const timeStatusFiltersData: FilterItem[] = [
  { type: 'eventTimeStatus', nameEn: 'Future', nameUa: 'Майбутній' },
  { type: 'eventTimeStatus', nameEn: 'Past', nameUa: 'Завершений' }
];

export enum DefaultCoordinates {
  LATITUDE = 50.4501,
  LONGITUDE = 30.5234
}

export const statusFiltersData: FilterItem[] = [
  { type: 'status', nameEn: 'Open', nameUa: 'Відкритa' },
  { type: 'status', nameEn: 'Closed', nameUa: 'Закритa' },
  { type: 'status', nameEn: 'Joined', nameUa: 'Вже доєднані' },
  { type: 'status', nameEn: 'Created', nameUa: 'Створенa' },
  { type: 'status', nameEn: 'Saved', nameUa: 'Збережена' }
];

export const typeFiltersData: FilterItem[] = [
  { type: 'type', nameEn: 'Economic', nameUa: 'Економічний' },
  { type: 'type', nameEn: 'Social', nameUa: 'Соціальний' },
  { type: 'type', nameEn: 'Environmental', nameUa: 'Екологічний' }
];

export const DateObj = {
  date: null,
  startDate: '',
  finishDate: '',
  coordinates: {
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

export const EventFilterCriteria = {
  eventTime: [],
  cities: [],
  statuses: [],
  tags: []
};
