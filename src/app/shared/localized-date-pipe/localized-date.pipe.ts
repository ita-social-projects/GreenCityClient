import { Pipe, PipeTransform } from '@angular/core';

const getTimeZoneOffset = (tz: string) => {
  const date = new Date();
  // '9/19/2022, 3:57:26 AM GMT+5:30'
  const [, offsetStr] = date.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).split('GMT');
  const [hours, mins] = offsetStr.split(':').map((num) => parseInt(num, 10));
  if (!hours) {
    return 0;
  }
  const offset = mins ? (hours > 0 ? hours * 60 + mins : hours * 60 - mins) : hours * 60;
  return offset;
};

const getTimeZoneDiff = (tz1: string, tz2: string) => {
  const offset1 = getTimeZoneOffset(tz1);
  const offset2 = getTimeZoneOffset(tz2);
  return offset2 - offset1;
};

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

interface LocalizedDatePipeOptions {
  fromTimeZone?: string;
  toTimeZone?: string;
  locale?: string;
}

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  // Inputs: value: date, string, js timestamp in selected timezone (defaults to UTC)
  // Output: Formatted string adjusted to selected locale and timezone (defaults to en-US locale and system timezone)
  transform(value: string | Date | number | null | undefined, options?: LocalizedDatePipeOptions): string {
    if (!value) {
      return null;
    }
    const fromTimeZone = options?.fromTimeZone || 'UTC';
    const toTimeZone = options?.toTimeZone || localTimeZone;
    const locale = options?.locale || 'en-US';
    const isISOUTC = typeof value === 'string' && value.endsWith('Z');
    const normalized = isISOUTC ? (value as string).slice(0, -1) : value;
    const timestamp = new Date(normalized).getTime() + getTimeZoneDiff(fromTimeZone, toTimeZone) * 60000;
    return new Date(timestamp).toLocaleString(locale);
  }
}
