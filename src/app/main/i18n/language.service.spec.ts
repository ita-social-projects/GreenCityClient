import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Language } from './Language';
import { LanguageService } from './language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LanguageService', () => {
  let service: LanguageService;
  let localStorageService: LocalStorageService;
  let translate: TranslateService;
  let getCurrentLanguageMock: any;
  let setCurrentLanguageMock: any;
  let setDefaultLangMock: any;
  let setUseMock: any;

  const getLanguageByString = 'getLanguageByString';
  const defaultLanguage = 'defaultLanguage';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule]
    });

    service = TestBed.inject(LanguageService);
    translate = TestBed.inject(TranslateService);
    localStorageService = TestBed.inject(LocalStorageService);
    getCurrentLanguageMock = spyOn(localStorageService, 'getCurrentLanguage');
    setCurrentLanguageMock = spyOn(localStorageService, 'setCurrentLanguage');
    setDefaultLangMock = spyOn(translate, 'setDefaultLang');
    setUseMock = spyOn(translate, 'use');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCurrentLanguage should return the value', () => {
    getCurrentLanguageMock.and.returnValue('ua');
    const spy = service.getCurrentLanguage();
    expect(spy).toBe('ua');
  });

  it('getLangValue should return ua string', () => {
    getCurrentLanguageMock.and.returnValue('ua');
    const spy = service.getLangValue('valUa', 'valEn');
    expect(spy).toBe('valUa');
  });

  it('getLangValue should return ua value of string array', () => {
    getCurrentLanguageMock.and.returnValue('ua');
    const spy = service.getLangValue(['valUa'], ['valEn']);
    expect(spy).toEqual(['valUa']);
  });

  it('getLangValue should return en string', () => {
    getCurrentLanguageMock.and.returnValue('en');
    const spy = service.getLangValue('valUa', 'valEn');
    expect(spy).toBe('valEn');
  });

  it('getLangValue should return en value of string array', () => {
    getCurrentLanguageMock.and.returnValue('en');
    const spy = service.getLangValue(['valUa'], ['valEn']);
    expect(spy).toEqual(['valEn']);
  });

  it('getLanguageByString should return the language', () => {
    const spy = service[getLanguageByString]('ua');
    expect(spy).toBe('ua');
  });

  it('getLanguageByString should return default language', () => {
    service[defaultLanguage] = Language.UA;
    const spy = service[getLanguageByString]('de');
    expect(spy).toBe('ua');
  });

  it('getLocalizedMonth should return the month', () => {
    getCurrentLanguageMock.and.returnValue('ua');
    const spy = service.getLocalizedMonth(2);
    expect(spy).toBe('березня');
  });

  it('setCurrentLanguage and setDefaultLang should be called in changeCurrentLanguage', () => {
    service.changeCurrentLanguage(Language.UA);
    expect(setDefaultLangMock).toHaveBeenCalledWith('ua');
    expect(setCurrentLanguageMock).toHaveBeenCalledWith('ua');
    expect(setUseMock).toHaveBeenCalledWith('ua');
  });

  it('getLanguageId should return the value', () => {
    service.synqLanguageArr = [
      { id: 111, code: 'ua' },
      { id: 222, code: 'en' },
      { id: 333, code: 'ru' }
    ];
    const spy = service.getLanguageId(Language.UA);
    expect(spy).toBe(111);
  });
});
