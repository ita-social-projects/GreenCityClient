import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uncheckedFirst'
})
export class UncheckedFirstPipe implements PipeTransform {
  transform(values: any): any {
    return values.sort(el => {
      return el.status === 'ACTIVE' ? -1 : 1;
    });
  }
}
