import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../main/i18n/Language';
import { take } from 'rxjs/operators';

@Pipe({
  name: 'relativeDate',
  pure: false
})
export class RelativeDatePipe implements PipeTransform {
  constructor(public translateService: TranslateService) {}
  millisecondsInDay = 86400000;

  transform(value: any): string | null {
    const datePipe = new DatePipe(this.translateService.currentLang);
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

    const format = this.translateService.currentLang === Language.UA ? 'MMM dd, yyyy hh:mm' : 'MMM dd, yyyy hh:mm a';
    return datePipe.transform(value, format, '', this.translateService.currentLang);
  }
}
