import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showFirstN'
})
export class ShowFirstNPipe implements PipeTransform {
  transform(values: any, n: number, collapse: boolean): any {
    return collapse ? [...values.slice(0, n)] : values;
  }
}
