import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Pipe({
  name: 'tariffStatus'
})
export class TariffStatusPipe implements PipeTransform {
  constructor(private localStorageService: LocalStorageService) {}

  transform(value: string) {
    const lang = this.localStorageService.getCurrentLanguage();
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
