import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of } from 'rxjs';
import { FilterLocationListByLangPipe } from './filter-location-list-by-lang.pipe';

describe('FilterLocationListByLangPipe', () => {
  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'getCurrentLanguage'
  ]);
  localStorageServiceMock.getCurrentLanguage = () => 'fakeLanguage' as any;
  localStorageServiceMock.languageSubject = of('fakeLanguage') as any;

  it('create an instance', () => {
    const pipe = new FilterLocationListByLangPipe(localStorageServiceMock);
    expect(pipe).toBeTruthy();
  });
});
