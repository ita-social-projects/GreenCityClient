import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  // Output: date string in ISO format
  transform(value: string | Date | number | null | undefined): string {
    if (!value) {
      return null;
    }
    const timezoneOffset = new Date().getTimezoneOffset();
    const timestamp = new Date(value).getTime();
    const local = timestamp - timezoneOffset * 60000;
    return new Date(local).toISOString();
  }
}
