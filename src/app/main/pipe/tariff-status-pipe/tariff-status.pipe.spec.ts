import { TariffStatusPipe } from './tariff-status.pipe';

describe('TariffStatusPipe', () => {
  const pipe = new TariffStatusPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform', () => {
    expect(pipe.transform('NEW')).toBe('Незаповнена');
  });

  it('should transform', () => {
    expect(pipe.transform('ACTIVE')).toBe('Активно');
  });

  it('should transform', () => {
    expect(pipe.transform('NOTACTIVE')).toBe('Неактивно');
  });
});
