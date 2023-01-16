import { Language } from '../../i18n/Language';
import { TariffStatusPipe } from './tariff-status.pipe';

describe('TariffStatusPipe', () => {
  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage']);

  const pipe = new TariffStatusPipe(localStorageServiceMock);

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform NEW to ua status', () => {
    localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;
    expect(pipe.transform('NEW')).toBe('Незаповнена');
  });

  it('should transform NEW to en status', () => {
    localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
    expect(pipe.transform('NEW')).toBe('Blank');
  });

  it('should transform ACTIVE to ua status', () => {
    localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;
    expect(pipe.transform('ACTIVE')).toBe('Активно');
  });

  it('should transform ACTIVE to en status', () => {
    localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
    expect(pipe.transform('ACTIVE')).toBe('Active');
  });

  it('should transform NOACTIVE to ua status', () => {
    localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;
    expect(pipe.transform('NOTACTIVE')).toBe('Неактивно');
  });

  it('should transform NOACTIVE to en status', () => {
    localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
    expect(pipe.transform('NOTACTIVE')).toBe('Inactive');
  });
});
