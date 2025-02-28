import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of } from 'rxjs';
import { FilterListByLangPipe } from './filter-list-by-lang.pipe';

describe('FilterListByLangPipe', () => {
  let pipe: FilterListByLangPipe;
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'en';
  localStorageServiceMock.languageSubject = of('en');
  const fakeList = [{ languageCode: 'ua' }, { languageCode: 'en' }, { languageCode: 'de' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterListByLangPipe],
      providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }]
    });
    pipe = new FilterListByLangPipe(localStorageServiceMock);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('locale has default value', fakeAsync(() => {
    tick();
    expect((pipe as any).locale).toBe('en');
  }));

  it('should transform correctly', fakeAsync(() => {
    tick();
    expect(pipe.transform(fakeList)).toEqual([{ languageCode: 'en' }]);
  }));
});
