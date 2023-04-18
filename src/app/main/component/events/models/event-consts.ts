export enum ItemTime {
  START = '00 : 00',
  END = '23 : 59'
}

export interface OptionItem {
  nameEn: string;
  nameUa: string;
}

export interface AllSelectedFlags {
  typeList: boolean;
  timeList: boolean;
  statusList: boolean;
  locationList: boolean;
}

export const allSelectedFlags = {
  timeList: false,
  statusList: false,
  typeList: false,
  locationList: false
};

export const TagsArray = [
  { nameEn: 'Economic', nameUa: 'Економічний', isActive: false },
  { nameEn: 'Social', nameUa: 'Соціальний', isActive: false },
  { nameEn: 'Environmental', nameUa: 'Екологічний', isActive: false }
];

export const eventTimeList = [
  { nameEn: 'Upcoming', nameUa: 'Майбутній' },
  { nameEn: 'Passed', nameUa: 'Завершений' }
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

export const WeekArray = ['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days'];
