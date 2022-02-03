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
      let value = undefined;
      const res = pipe.transform(value, 'ua');
      expect(res).toBe('Empty value');
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
  });
});
