import { Pipe, PipeTransform } from '@angular/core';
import { CronService } from '@ubs/ubs-admin/services/cron/cron.service';
import enLocale from '@ubs/ubs-admin/services/cron/locales/en.json';
import ukLocale from '@ubs/ubs-admin/services/cron/locales/uk.json';

@Pipe({
  name: 'cron'
})
export class CronPipe implements PipeTransform {
  localesNone = {
    en: enLocale,
    uk: ukLocale
  };
  constructor(private cronService: CronService) {}

  transform(value: string, lang = 'en'): string {
    const locales = {
      en: 'en',
      ua: 'uk'
    };

    if (!value) {
      return this.localesNone[locales[lang]].none;
    }

    return this.cronService.descript(value, locales[lang]);
  }
}
