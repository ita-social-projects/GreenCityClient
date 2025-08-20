import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serverTranslate'
})
export class ServerTranslatePipe implements PipeTransform {
  transform(value: any, currentLang: string) {
    if (value === undefined || value === null) {
      return;
    }
    if (typeof value !== 'object' && typeof value !== 'function') {
      return value;
    }
    if (currentLang === 'uk') {
      return value.uk;
    } else {
      return value.en;
    }
  }
}
