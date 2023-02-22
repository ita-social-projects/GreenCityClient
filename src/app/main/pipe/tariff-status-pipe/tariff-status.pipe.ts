import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tariffStatus'
})
export class TariffStatusPipe implements PipeTransform {
  transform(value: string, lang: string) {
    switch (value) {
      case 'NEW':
        return lang === 'ua' ? 'Незаповнена' : 'Blank';
      case 'ACTIVE':
        return lang === 'ua' ? 'Активно' : 'Active';
      default:
        return lang === 'ua' ? 'Неактивно' : 'Inactive';
    }
  }
}
