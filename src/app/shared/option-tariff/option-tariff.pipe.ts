import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optionTariff'
})
export class OptionPipe implements PipeTransform {
  transform(list, value: string[], key: string[]) {
    value.forEach((name, index) => {
      if (name === 'all') {
        return list;
      }
      if (name && list) {
        list = list.filter((item) => {
          if (typeof item[key[index]] === 'object') {
            return (
              item[key[index]]
                .filter((it) => it.languageCode === 'ua')
                .map((it) => it.name)
                .join() === name
            );
          } else {
            return item[key[index]] === name;
          }
        });
      }
    });
    if (!list) {
      return [-1];
    }
    return list;
  }
}
