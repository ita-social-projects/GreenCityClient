import { LocalizedDatePipe } from './localized-date.pipe';

describe('LocalizedDatePipe', () => {
  it('create an instance', () => {
    const pipe = new LocalizedDatePipe();
    expect(pipe).toBeTruthy();
  });

  it('converts UTC date to date string with adjusted locale and timezone', () => {
    const pipe = new LocalizedDatePipe(); // +13
    const options = { fromTimeZone: 'America/Puerto_Rico', toTimeZone: 'Asia/Tokyo' };
    expect(pipe.transform('2022-09-09T13:59:17.320416', options)).toBe('9/10/2022, 2:59:17 AM');

    const options2 = { toTimeZone: 'IST', locale: 'en-GB' }; // +5:30
    expect(pipe.transform('2022-09-09T13:59:17.320Z', options2)).toBe('09/09/2022, 19:29:17');
    expect(pipe.transform(new Date('2022-09-09T13:59:17.320'), options2)).toBe('09/09/2022, 19:29:17');
  });

  it('returns null on empty input', () => {
    const pipe = new LocalizedDatePipe();
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform(undefined)).toBe(null);
    expect(pipe.transform('')).toBe(null);
  });
});
