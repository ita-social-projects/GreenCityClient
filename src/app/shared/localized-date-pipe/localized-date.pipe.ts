import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  locale = 'en-US';
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  setLocale(locale: string) {
    this.locale = locale;
  }

  setTimeZone(timeZone: string) {
    this.timeZone = timeZone;
  }

  // Input: date, string, js timestamp (UTC)
  // Output: Formatted string adjusted to locale and timezone
  transform(value: string | Date | number | null | undefined): string {
    if (!value) {
      return null;
    }
    const utcISOstring = typeof value === 'string' && (value.endsWith('Z') || value.endsWith('z'));
    const date = new Date(value).toString();
    const normalized = new Date(utcISOstring ? date : date + ' Z');
    return normalized.toLocaleString(this.locale, { timeZone: this.timeZone });
  }
}
