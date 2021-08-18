import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterLang',
  pure: false
})
export class FilterLangPipe implements PipeTransform {
  transform(langArr, lang) {
    return langArr.filter((value) => value.code === lang);
  }
}
