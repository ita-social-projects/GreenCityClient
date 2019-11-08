import {Injectable} from '@angular/core';
import {Language} from './Language';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService) {
  }

  public setDefaultLanguage(): void {
    let len = null;

    Object.values(Language).forEach(o => {
      if (o.toString() === navigator.language) {
        len = o;
      }
    });

    if (len !== null) {
      this.translate.setDefaultLang(len);
    } else {
      this.translate.setDefaultLang(Language.EN);
    }
  }
}
