import { TestBed, waitForAsync } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of } from 'rxjs';
import { FilterListByLangPipe } from './filter-list-by-lang.pipe';

describe('FilterListByLangPipe', () => {
  let pipe: FilterListByLangPipe;
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'en';
  localStorageServiceMock.languageSubject = of('en');
  const fakeList = [{ languageCode: 'ua' }, { languageCode: 'en' }, { languageCode: 'de' }];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilterListByLangPipe],
      providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }]
    }).compileComponents();
    pipe = new FilterListByLangPipe(localStorageServiceMock);
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('locale has default value', () => {
    expect((pipe as any).locale).toBe('en');
  });

  it('transform', () => {
    expect(pipe.transform(fakeList)).toEqual([{ languageCode: 'en' }]);
  });
});
