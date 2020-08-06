import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Language} from './Language';
import {LocalStorageService} from '../service/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private langMap = new Map();
  private defaultLanguage = Language.EN;
  private monthMap = new Map<Language, string[]>();

  constructor(private translate: TranslateService, private localStorageService: LocalStorageService) {
    this.langMap.set(Language.EN, ['en']);
    this.langMap.set(Language.UK, ['ua', 'uk']);
    this.langMap.set(Language.RU, ['ru']);

    this.monthMap.set(Language.UK, ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня',
      'листопада', 'грудня']);
    this.monthMap.set(Language.EN, ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',
      'november', 'december']);
    this.monthMap.set(Language.RU, ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября',
      'ноября', 'декабря']);
  }

  public setDefaultLanguage() {
    if (this.localStorageService.getCurrentLanguage() !== null) {
      this.translate.setDefaultLang(this.localStorageService.getCurrentLanguage());
    } else {
      this.translate.setDefaultLang(this.getLanguageByString(navigator.language));
      this.localStorageService.setCurrentLanguage(this.getLanguageByString(navigator.language));
    }
  }

  public getCurrentLanguage() {
    return this.localStorageService.getCurrentLanguage();
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
  }
}
