import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchTariff'
})
export class SearchPipe implements PipeTransform {
  transform(list: any[], value: string[], key: string[]): any {
    value.forEach((name: string, index) => {
      if (name === 'Усі') {
        return list;
      }
      if (name) {
        list = list.filter((item) => {
          return (
            item[key[index]]
              .filter((it) => it.languageCode === 'ua')
              .map((it) => it.regionName)
              .join()
              .toString()
              .toLowerCase()
              .indexOf(name.toString().toLowerCase()) !== -1
          );
        });
      }
    });
    return list;
  }
}
