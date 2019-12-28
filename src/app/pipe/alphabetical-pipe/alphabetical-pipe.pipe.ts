import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alphabetical'
})
export class AlphabeticalPipePipe implements PipeTransform {
  transform(values: any): any {
    return values.sort((a, b) => {
      return a.text > b.text ? -1 : 1;
    });
  }
}
