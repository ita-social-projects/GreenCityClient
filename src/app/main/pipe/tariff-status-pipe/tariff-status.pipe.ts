import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tariffStatus'
})
export class TariffStatusPipe implements PipeTransform {
  transform(value: string) {
    if (value === 'NEW') {
      return (value = 'Незаповнена');
    } else if (value === 'ACTIVE') {
      return (value = 'Активно');
    } else {
      return (value = 'Неактивно');
    }
  }
}
