import { ServerTranslatePipe } from './translate-pipe.pipe';

describe('ServerTranslatePipe', () => {
  const fakeValue = {
    ua: 'fake ua value',
    en: 'fake en value'
  };

  it('create an instance', () => {
    const pipe = new ServerTranslatePipe();
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('if value is undefined', () => {
      const pipe = new ServerTranslatePipe();
      const res = pipe.transform(undefined, 'ua');
      expect(res).toBeUndefined();
    });

    it('if currentLang is "ua"', () => {
      const pipe = new ServerTranslatePipe();
      const res = pipe.transform(fakeValue, 'ua');
      expect(res).toBe('fake ua value');
    });

    it('if currentLang is "en"', () => {
      const pipe = new ServerTranslatePipe();
      const res = pipe.transform(fakeValue, 'en');
      expect(res).toBe('fake en value');
    });

    it('if value is not object', () => {
      const pipe = new ServerTranslatePipe();
      const res = pipe.transform(7, 'en');
      expect(res).toBe(7);
    });
  });
});
