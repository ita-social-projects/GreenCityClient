import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Language} from './Language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private langMap = new Map();
  private defaultLanguage = Language.EN;

  constructor(private translate: TranslateService) {
    this.langMap.set(Language.EN, ['en']);
    this.langMap.set(Language.UA, ['ua', 'uk']);
    this.langMap.set(Language.RU, ['ru']);
  }

  public setDefaultLanguage() {
    this.translate.setDefaultLang(this.getLanguageByString(navigator.language));
  }

  private getLanguageByString(languageString: string) {
    for (const key of this.langMap.keys()) {
      if (this.langMap.get(key).indexOf(languageString) !== -1) {
        console.log(key);
        return key;
      }
    }

    return this.defaultLanguage;
  }
}
