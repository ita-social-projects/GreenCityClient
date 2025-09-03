import { FilterItem } from './events.interface';

export const ICONS = {
  socials: {
    plus: 'assets/img/events/plus.svg',
    twitter: 'assets/img/events/twitter.svg',
    linkedin: 'assets/img/events/linkedin.svg',
    facebook: 'assets/img/events/facebook.svg'
  },
  clock: 'assets/img/events/clock.svg',
  location: 'assets/img/events/location.svg',
  link: 'assets/img/events/link.svg',
  lock: {
    open: 'assets/img/events/lock.svg',
    closed: 'assets/img/events/lock-closed.svg'
  },
  user: 'assets/img/events/user.svg',
  ellipsis: 'assets/img/events/ellipsis.svg',
  arrowLeft: 'assets/img/icon/econews/arrow_left.svg'
};

export const ROLES = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  USER: 'USER',
  ORGANIZER: 'ORGANIZER',
  ADMIN: 'ADMIN'
};

export const timeStatusFiltersData: FilterItem[] = [
  { type: 'eventTimeStatus', nameEn: 'Upcoming', nameUk: 'Майбутні' },
  { type: 'eventTimeStatus', nameEn: 'Past', nameUk: 'Завершені' }
];

export enum DefaultCoordinates {
  LATITUDE = 50.4501,
  LONGITUDE = 30.5234
}

export const statusFiltersData: FilterItem[] = [
  { type: 'status', nameEn: 'Open', nameUk: 'Відкритa' },
  { type: 'status', nameEn: 'Closed', nameUk: 'Закритa' },
  { type: 'status', nameEn: 'Joined', nameUk: 'Вже доєднані' },
  { type: 'status', nameEn: 'Created', nameUk: 'Створенa' },
  { type: 'status', nameEn: 'Saved', nameUk: 'Збережена' }
];

export const typeFiltersData: FilterItem[] = [
  { type: 'type', nameEn: 'Economic', nameUk: 'Економічний' },
  { type: 'type', nameEn: 'Social', nameUk: 'Соціальний' },
  { type: 'type', nameEn: 'Environmental', nameUk: 'Екологічний' }
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
  { nameEn: '1 day', nameUk: '1 день' },
  { nameEn: '2 days', nameUk: '2 дні' },
  { nameEn: '3 days', nameUk: '3 дні' },
  { nameEn: '4 days', nameUk: '4 дні' },
  { nameEn: '5 days', nameUk: '5 днів' },
  { nameEn: '6 days', nameUk: '6 днів' },
  { nameEn: '7 days', nameUk: '7 днів' }
];

export const EventFilterCriteria = {
  eventTime: [],
  cities: [],
  statuses: [],
  tags: []
};

export const EVENT_LOCALE = {
  durationDays: [
    { en: '1 day', uk: '1 день' },
    { en: '2 days', uk: '2 дні' },
    { en: '3 days', uk: '3 дні' },
    { en: '4 days', uk: '4 дні' },
    { en: '5 days', uk: '5 днів' },
    { en: '6 days', uk: '6 днів' },
    { en: '7 days', uk: '7 днів' }
  ],
  titleError: {
    uk: 'Введіть заголовок до 70 символів включно',
    en: 'Enter a title up to and including 70 characters'
  },
  quillError: {
    uk: 'Недостатньо символів. Залишилось:',
    en: 'Not enough characters. Left:'
  },
  quillMaxExceeded: {
    uk: 'Максимальна довжина символів більше ніж',
    en: 'The maximum character length is greater than'
  },
  quillValid: {
    uk: 'Кількість символів:',
    en: 'Number of characters:'
  },
  quillDefault: {
    uk: '',
    en: ''
  },
  eventTypeOptions: [
    { en: 'Closed', uk: 'Закрита' },
    { en: 'Open', uk: 'Відкрита' }
  ],
  initiativeTags: [
    { en: 'Economic', uk: 'Економічний' },
    { en: 'Social', uk: 'Соціальний' },
    { en: 'Environmental', uk: 'Екологічний' }
  ],
  dateError: {
    en: 'Past date',
    uk: 'Минула дата'
  }
};

export type EventLocaleKeys = keyof typeof EVENT_LOCALE;
