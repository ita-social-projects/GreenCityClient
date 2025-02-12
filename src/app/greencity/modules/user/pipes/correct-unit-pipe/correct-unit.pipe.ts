import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'correctUnit'
})
export class CorrectUnitPipe implements PipeTransform {
  transform(unit: string, value: number, lang: string): string {
    let result = unit;
    if (lang === 'ua') {
      if (value % 10 === 1 && value !== 11) {
        result += '.singular';
      } else if ([2, 3, 4].some((el) => el === value % 10)) {
        result += '.plural.units-2-3-4';
      } else {
        result += '.plural.units-more-5';
      }
      return result;
    }
    result = value === 1 ? `${unit}.singular` : `${unit}.plural`;
    return result;
  }
}
