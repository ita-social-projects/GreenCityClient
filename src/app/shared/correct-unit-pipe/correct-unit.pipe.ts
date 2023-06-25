import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'correctUnit'
})
export class CorrectUnitPipe implements PipeTransform {
  transform(unit: string, value: number, lang: string): string {
    if (lang === 'ua') {
      let result = unit;
      if (value % 10 === 1 && value !== 11) {
        result = result += '.singular';
      } else if ([2, 3, 4].some((el) => el === value % 10)) {
        result = result += '.plural.units-2-3-4';
      } else {
        result = result += '.plural.units-more-5';
      }
      return result;
    }

    return value === 1 ? (unit += '.singular') : (unit += '.plural');
  }
}
