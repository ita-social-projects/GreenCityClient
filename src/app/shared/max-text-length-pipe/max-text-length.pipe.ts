import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxTextLength'
})
export class MaxTextLengthPipe implements PipeTransform {
  transform(textName: string, maxTextLength = 15): string {
    if (!textName) {
      return '';
    }
    return textName.length > maxTextLength ? textName.slice(0, maxTextLength) + '...' : textName;
  }
}
