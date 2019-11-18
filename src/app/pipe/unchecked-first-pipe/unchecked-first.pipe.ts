import { Pipe, PipeTransform } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Goal } from 'src/app/model/goal/Goal';

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
