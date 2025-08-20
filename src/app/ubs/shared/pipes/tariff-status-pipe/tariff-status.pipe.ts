import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tariffStatus'
})
export class TariffStatusPipe implements PipeTransform {
  transform(value: string, lang: string) {
    switch (value) {
      case 'NEW':
        return lang === 'uk' ? 'Незаповнена' : 'Blank';
      case 'ACTIVE':
        return lang === 'uk' ? 'Активно' : 'Active';
      default:
        return lang === 'uk' ? 'Неактивно' : 'Inactive';
    }
  }
}
