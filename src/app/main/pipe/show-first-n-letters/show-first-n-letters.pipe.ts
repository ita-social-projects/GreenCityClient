import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showFirstNLetters'
})
export class ShowFirstNLettersPipe implements PipeTransform {
  transform(value: string, n: number, placeholder: string): string {
    return value.length > n ? value.substring(0, n) + placeholder : value;
  }
}
