import { LocalStorageService } from './../service/localstorage/local-storage.service';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './Language';
import { LanguageId } from '../interface/language-id';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { langValue } from '../interface/langValue';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { userLink } from '../links';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private defaultLanguage = Language.EN;
  private monthMap = new Map<Language, string[]>();
  private languageSubj = new BehaviorSubject(Language.EN);
  private langMap = new Map();
  public isLoggedIn = false;
  public synqLanguageArr: LanguageId[] = [
    { id: 1, code: 'ua' },
    { id: 2, code: 'en' },
    { id: 3, code: 'ru' }
  ];

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private userOwnAuthService: UserOwnAuthService,
    private localStorageService: LocalStorageService
  ) {
    this.langMap.set(Language.EN, ['en']);
    this.langMap.set(Language.UA, ['ua']);
    this.langMap.set(Language.RU, ['ru']);

    this.monthMap.set(Language.UA, [
      'січня',
      'лютого',
      'березня',
      'квітня',
      'травня',
      'червня',
      'липня',
      'серпня',
      'вересня',
      'жовтня',
      'листопада',
      'грудня'
    ]);
    this.monthMap.set(Language.EN, [
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
    this.monthMap.set(Language.RU, [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря'
    ]);
  }

  public getUserLangValue() {
    return this.http.get(`${userLink}/lang`, { responseType: 'text' });
  }

  private checkLogin() {
    this.userOwnAuthService.isLoginUserSubject.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  public setDefaultLanguage() {
    this.checkLogin();
    if (this.isLoggedIn) {
      this.getUserLangValue()
        .pipe(
          tap((userLanguage) => {
            if (userLanguage) {
              this.translate.setDefaultLang(this.getLanguageByString(userLanguage));
              this.localStorageService.setCurrentLanguage(this.getLanguageByString(userLanguage));
            }
          })
        )
        .subscribe(
          () => {},
          (error) => {
            this.setBrowserLang();
          }
        );
    } else {
      this.setBrowserLang();
    }
  }

  setBrowserLang() {
    const language = navigator.language !== Language.EN ? Language.UA : navigator.language;
    this.translate.setDefaultLang(this.getLanguageByString(language));
    this.localStorageService.setCurrentLanguage(this.getLanguageByString(language));
  }

  public getCurrentLanguage() {
    return this.localStorageService.getCurrentLanguage();
  }

  public getLangValue(uaValue: langValue, enValue: langValue): langValue {
    return this.localStorageService.getCurrentLanguage() === 'ua' ? uaValue : enValue;
  }

  private getLanguageByString(languageString: string) {
    for (const key of this.langMap.keys()) {
      if (this.langMap.get(key).indexOf(languageString) !== -1) {
        return key;
      }
    }

    return this.defaultLanguage;
  }

  public getLocalizedMonth(month: number) {
    return this.monthMap.get(this.getCurrentLanguage())[month];
  }

  public changeCurrentLanguage(language: Language) {
    this.localStorageService.setCurrentLanguage(language);
    this.translate.setDefaultLang(language);
    this.translate.use(language);
    this.languageSubj.next(language);
  }

  public getCurrentLangObs() {
    return this.languageSubj.asObservable();
  }

  public getLanguageId(language: Language) {
    return this.synqLanguageArr.find((res) => res.code === language).id;
  }
}
