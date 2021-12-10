import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { LanguageService } from './language.service';

fdescribe('LanguageService', () => {
  let service: LanguageService;
  let localStorageService: LocalStorageService;
  let translate: TranslateService;
  let getCurrentLanguageMock: any;
  let setCurrentLanguageMock: any;
  let setDefaultLangMock: any;

  const langMap = 'langMap';
  const monthMap = 'monthMap';
  const getLanguageByString = 'getLanguageByString';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    });

    service = TestBed.inject(LanguageService);
    translate = TestBed.inject(TranslateService);
    localStorageService = TestBed.inject(LocalStorageService);
    getCurrentLanguageMock = spyOn(localStorageService, 'getCurrentLanguage');
    setCurrentLanguageMock = spyOn(localStorageService, 'setCurrentLanguage');
    setDefaultLangMock = spyOn(translate, 'setDefaultLang');
    spyOn(service[langMap], 'set');
    spyOn(service[monthMap], 'set');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setDefaultLang should be called in setDefaultLanguage with parameter from getCurrentLanguage', () => {
    getCurrentLanguageMock.and.returnValue('ua');
    service.setDefaultLanguage();
    expect(setDefaultLangMock).toHaveBeenCalledWith('ua');
  });

  it('setDefaultLang and setCurrentLanguage should be called in setDefaultLanguage with parameters', () => {
    getCurrentLanguageMock.and.returnValue(null);
    spyOn(LanguageService.prototype as any, 'getLanguageByString').and.returnValue('ua');
    service.setDefaultLanguage();
    expect(setDefaultLangMock).toHaveBeenCalledWith('ua');
    expect(setCurrentLanguageMock).toHaveBeenCalledWith('ua');
  });

  it('getCurrentLanguage should return the value', () => {
    getCurrentLanguageMock.and.returnValue('ua');
    const spy = service.getCurrentLanguage();
    expect(spy).toBe('ua');
  });
});
