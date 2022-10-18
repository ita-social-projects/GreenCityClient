import { LanguageService } from 'src/app/main/i18n/language.service';
import { TranslateDatePipe } from './translate-date.pipe';

describe('VolumePipe', () => {
  const translateMock = jasmine.createSpyObj('translate', ['']);
  translateMock.monthMap = new Set([
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ]);
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'en';

  const pipe = new TranslateDatePipe(new LanguageService(translateMock, localStorageServiceMock));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transform', () => {
    const dateString = '20 9 2022';
    const localizedDate = '20 September 2022';
    expect(pipe.transform(dateString)).toEqual(localizedDate);
  });
});
