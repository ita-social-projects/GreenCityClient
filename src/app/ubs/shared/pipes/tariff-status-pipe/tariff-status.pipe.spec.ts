import { TariffStatusPipe } from './tariff-status.pipe';

describe('TariffStatusPipe', () => {
  const pipe = new TariffStatusPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform NEW to uk status', () => {
    expect(pipe.transform('NEW', 'uk')).toBe('Незаповнена');
  });

  it('should transform NEW to en status', () => {
    expect(pipe.transform('NEW', 'en')).toBe('Blank');
  });

  it('should transform ACTIVE to uk status', () => {
    expect(pipe.transform('ACTIVE', 'uk')).toBe('Активно');
  });

  it('should transform ACTIVE to en status', () => {
    expect(pipe.transform('ACTIVE', 'en')).toBe('Active');
  });

  it('should transform NOACTIVE to uk status', () => {
    expect(pipe.transform('NOTACTIVE', 'uk')).toBe('Неактивно');
  });

  it('should transform NOACTIVE to en status', () => {
    expect(pipe.transform('NOTACTIVE', 'en')).toBe('Inactive');
  });
});
