export enum ItemTime {
  START = '00 : 00',
  END = '23 : 59'
}

export const TagsArray = [
  { nameEn: 'Environmental', nameUa: 'Екологічний', isActive: false },
  { nameEn: 'Social', nameUa: 'Соціальний', isActive: false },
  { nameEn: 'Economic', nameUa: 'Економічний', isActive: false }
];

export const eventTimeList = [
  { nameEn: 'Upcoming', nameUa: 'Майбутній' },
  { nameEn: 'Passed', nameUa: 'Завершений' }
];

export const eventStatusList = [
  { nameEn: 'Open', nameUa: 'Відкритий' },
  { nameEn: 'Closed', nameUa: 'Закритий' }
];

// TODO remove when back-end is ready

export const tempLocationList = [
  { nameEn: 'Lviv', nameUa: 'Львів' },
  { nameEn: 'Odesa', nameUa: 'Одеса' },
  { nameEn: 'Kyiv', nameUa: 'Київ' },
  { nameEn: 'Kharkiv', nameUa: 'Харків' },
  { nameEn: 'Sevastopol', nameUa: 'Севастополь' },
  { nameEn: 'Donetsk', nameUa: 'Донецьк' }
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
