import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Language } from './Language';
import { LanguageService } from './language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('LanguageService', () => {
  let service: LanguageService;
  let localStorageService: LocalStorageService;
  let translate: TranslateService;
  let getCurrentLanguageMock: any;
  let setCurrentLanguageMock: any;
  let setDefaultLangMock: any;
  let setUseMock: any;
  let isLoginUserSubject: BehaviorSubject<boolean>;

  const defaultLanguage: Language = Language.EN;
  const getLanguageByString = 'getLanguageByString';
  let userOwnAuthServiceMock: jasmine.SpyObj<UserOwnAuthService>;

  beforeEach(() => {
    isLoginUserSubject = new BehaviorSubject<boolean>(true);
    userOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', [], {
      isLoginUserSubject: isLoginUserSubject.asObservable()
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: UserOwnAuthService, useValue: userOwnAuthServiceMock }]
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
    const spy = service[getLanguageByString]('en');
    expect(spy).toBe('en');
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

  it('should set default language if user is logged in and language value is retrieved', () => {
    const mockLanguage = Language.UA;
    spyOn(service, 'getUserLangValue').and.returnValue(of(mockLanguage));
    service.setDefaultLanguage();
    expect(service.getUserLangValue).toHaveBeenCalled();
    expect(setCurrentLanguageMock).toHaveBeenCalledWith(mockLanguage);
    expect(translate.use).toHaveBeenCalledWith(mockLanguage);
  });

  it('should set browser language if user is not logged in', () => {
    isLoginUserSubject.next(false);
    const setBrowserLangSpy = spyOn(service, 'setBrowserLang').and.callThrough();
    service.setDefaultLanguage();
    expect(setBrowserLangSpy).toHaveBeenCalled();
  });

  it('should handle errors from getUserLangValue', () => {
    spyOn(service, 'getUserLangValue').and.returnValue(throwError(() => new Error('Error')));
    const setBrowserLangSpy = spyOn(service, 'setBrowserLang').and.callThrough();
    service.setDefaultLanguage();
    expect(service.getUserLangValue).toHaveBeenCalled();
    expect(setBrowserLangSpy).toHaveBeenCalled();
  });
});
