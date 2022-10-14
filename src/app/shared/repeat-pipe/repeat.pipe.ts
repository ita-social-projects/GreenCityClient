import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'repeat'
})
export class RepeatPipe implements PipeTransform {
  transform(value: number) {
    if (typeof value !== 'number' || value < 0) {
      return [];
    }
    return new Array(value).fill(null);
  }
}
