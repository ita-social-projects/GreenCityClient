import { LocalStorageService } from './../service/localstorage/local-storage.service';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './Language';
import { LanguageId } from '../interface/language-id';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { userLink } from '../links';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { Observable } from 'rxjs';

type TLangValue = string | string[];
type TLangValueReturnType<T extends TLangValue> = T extends string ? string : string[];

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private defaultLanguage = Language.EN;
  private monthMap = new Map<Language, string[]>();
  private languageSubj = new BehaviorSubject(Language.EN);
  isLoggedIn = false;
  synqLanguageArr: LanguageId[] = [
    { id: 1, code: 'ua' },
    { id: 2, code: 'en' },
    { id: 3, code: 'ru' }
  ];

  private languageMap: { [key: string]: Language } = {
    uk: Language.UA,
    ua: Language.UA,
    en: Language.EN
  };

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private userOwnAuthService: UserOwnAuthService,
    private localStorageService: LocalStorageService
  ) {
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

  getUserLangValue(): Observable<string> {
    return this.http.get(`${userLink}/lang`, { responseType: 'text' }).pipe(tap((lang) => this.changeCurrentLanguage(lang as Language)));
  }

  private checkLogin() {
    this.userOwnAuthService.isLoginUserSubject.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  setDefaultLanguage() {
    this.checkLogin();
    if (this.isLoggedIn) {
      this.getUserLangValue()
        .pipe(
          tap((userLanguage) => {
            if (userLanguage) {
              this.changeCurrentLanguage(userLanguage as Language);
            }
          })
        )
        .subscribe({
          next: () => {},
          error: () => this.setBrowserLang()
        });
    } else {
      this.setBrowserLang();
    }
  }

  setBrowserLang() {
    const language = this.getLanguageByString(navigator.language);
    this.changeCurrentLanguage(language);
  }

  getCurrentLanguage(): Language {
    return this.localStorageService.getCurrentLanguage();
  }

  getLangValue<T extends TLangValue>(uaValue: T, enValue: T): TLangValueReturnType<T> {
    return (this.localStorageService.getCurrentLanguage() === 'ua' ? uaValue : enValue) as TLangValueReturnType<T>;
  }

  private getLanguageByString(languageString: string) {
    const language = languageString.substring(0, 2).toLowerCase();
    return this.languageMap[language] || this.defaultLanguage;
  }

  getLocalizedMonth(month: number): string {
    return this.monthMap.get(this.getCurrentLanguage())[month];
  }

  changeCurrentLanguage(language: Language): void {
    this.localStorageService.setCurrentLanguage(language);
    this.translate.setDefaultLang(language);
    this.translate.use(language);
    this.languageSubj.next(language);
  }

  getCurrentLangObs(): Observable<Language> {
    return this.languageSubj.asObservable();
  }

  getLanguageId(language: Language): number {
    return this.synqLanguageArr.find((res) => res.code === language).id;
  }
}
