import { Pipe, PipeTransform } from '@angular/core';

import { LanguageService } from 'src/app/main/i18n/language.service';

@Pipe({
  name: 'translateDate',
  pure: false
})
export class TranslateDatePipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}

  transform(date: string): string {
    const [day, month, year] = date?.split(' ');
    const monthIndex = Number(month) - 1;
    let localizedMonth = this.languageService.getLocalizedMonth(monthIndex);
    localizedMonth = localizedMonth[0].toUpperCase() + localizedMonth.slice(1);
    return `${day} ${localizedMonth} ${year}`;
  }
}
