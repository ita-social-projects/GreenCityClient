import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';

@Pipe({
  name: 'tariffStatus'
})
export class TariffStatusPipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}

  transform(value: string) {
    const lang = this.languageService.getCurrentLanguage();
    switch (value) {
      case 'NEW':
        return lang === 'ua' ? 'Незаповнена' : 'Blank';
      case 'ACTIVE':
        return lang === 'ua' ? 'Активно' : 'Active';
      default:
        return 'Неактивно';
    }
  }
}
