export enum ItemTime {
  START = '00 : 00',
  END = '23 : 59'
}

export const TagsArray = [
  { nameEn: 'Environmental', nameUa: 'Екологічний', isActive: false },
  { nameEn: 'Social', nameUa: 'Соціальний', isActive: false },
  { nameEn: 'Economic', nameUa: 'Економічний', isActive: false }
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
