import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firststringword'
})
export class FirstStringWordPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.split(' ')[0];
  }
}
