import { Pipe, PipeTransform } from '@angular/core';
import { CronService } from '../cron/cron.service';

@Pipe({
  name: 'cron'
})
export class CronPipe implements PipeTransform {
  constructor(private cronService: CronService) {}

  transform(value: string, lang: string = 'en'): string {
    if (!value) {
      return null;
    }
    const locales = {
      en: 'en',
      ua: 'uk'
    };
    return this.cronService.descript(value, locales[lang]);
  }
}
