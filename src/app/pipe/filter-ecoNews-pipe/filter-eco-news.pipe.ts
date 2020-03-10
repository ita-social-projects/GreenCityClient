import { Pipe, PipeTransform } from '@angular/core';
import { EcoNewsModel } from 'src/app/model/eco-news/eco-news-model';

@Pipe({
  name: 'filterEcoNews'
})
export class FilterEcoNewsPipe implements PipeTransform {

  transform(ecoNewsArray: Array<EcoNewsModel>, newsFilter: Array<string>): Array<EcoNewsModel> {

    if (newsFilter.length) {
      const newFormatArray: Array<EcoNewsModel> = [];
      ecoNewsArray.forEach((elem: EcoNewsModel) => {
        elem.tag.forEach(element => {
          if (newsFilter.includes(element)) {
            newFormatArray.push(elem);
          }
        });
      });
      return newFormatArray;
    } else {
      return ecoNewsArray;
    }
  }

}
