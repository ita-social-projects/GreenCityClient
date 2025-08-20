import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../i18n/Language';
import { take } from 'rxjs/operators';

@Pipe({
  name: 'relativeDate',
  pure: false
})
export class RelativeDatePipe implements PipeTransform {
  constructor(public translateService: TranslateService) {}
  millisecondsInDay = 86400000;

  transform(value: any): string | null {
    // Map language codes to proper locale codes for DatePipe
    const localeMap = {
      uk: 'uk-UA',
      en: 'en-GB'
    };
    const locale = localeMap[this.translateService.currentLang] || this.translateService.currentLang;
    const datePipe = new DatePipe(locale);
    if (!value) {
      return value;
    }
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = datePipe.transform(date, 'shortDate') === datePipe.transform(today, 'shortDate');
    const isYesterday = today.getTime() - date.getTime() < this.millisecondsInDay;

    if (isToday) {
      let transformedValue: string;
      this.translateService
        .get('homepage.notifications.today')
        .pipe(take(1))
        .subscribe((res: string) => {
          transformedValue = res;
        });
      return transformedValue || value;
    }

    if (isYesterday) {
      let transformedValue: string;
      this.translateService
        .get('homepage.notifications.yesterday')
        .pipe(take(1))
        .subscribe((res: string) => {
          transformedValue = res;
        });
      return transformedValue || value;
    }

    const format = this.translateService.currentLang === Language.UK ? 'MMM dd, yyyy hh:mm' : 'MMM dd, yyyy hh:mm a';
    return datePipe.transform(value, format, '', locale);
  }
}
