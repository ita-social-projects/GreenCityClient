import { LocalizedDatePipe } from './localized-date.pipe';

describe('LocalizedDatePipe', () => {
  it('create an instance', () => {
    const pipe = new LocalizedDatePipe();
    expect(pipe).toBeTruthy();
  });

  it('converts UTC date to date string with adjusted locale and timezone', () => {
    const pipe = new LocalizedDatePipe();
    pipe.setTimeZone('America/Puerto_Rico');
    expect(pipe.transform('2022-09-09T13:59:17.320416')).toBe('9/9/2022, 9:59:17 AM');

    pipe.setLocale('en-GB');
    pipe.setTimeZone('Asia/Tokyo');
    expect(pipe.transform('2022-09-09T13:59:17.320Z')).toBe('09/09/2022, 22:59:17');
    expect(pipe.transform(new Date('2022-09-09T13:59:17.320'))).toBe('09/09/2022, 22:59:17');
  });

  it('returns null on empty input', () => {
    const pipe = new LocalizedDatePipe();
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform(undefined)).toBe(null);
    expect(pipe.transform('')).toBe(null);
  });
});
