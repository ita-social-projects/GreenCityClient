import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tariffStatus'
})
export class TariffStatusPipe implements PipeTransform {
  transform(value: string) {
    if (value === 'NEW') {
      return 'Незаповнена';
    } else if (value === 'ACTIVE') {
      return 'Активно';
    } else {
      return 'Неактивно';
    }
  }
}
