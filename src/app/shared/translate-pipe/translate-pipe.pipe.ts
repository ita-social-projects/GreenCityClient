import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serverTranslate'
})
export class ServerTranslatePipe implements PipeTransform {
  transform(value, currentLang: string) {
    if (value === undefined) {
      return 'Empty value';
    }
    if (currentLang === 'ua') {
      return value.ua;
    } else {
      return value.en;
    }
  }
}
