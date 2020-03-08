import { Pipe, PipeTransform } from '@angular/core';
import { EcoNews } from 'src/app/model/eco-news/eco-news.enum';
import { EcoNewsModel } from 'src/app/model/eco-news/eco-news-model';

@Pipe({
  name: 'filterEcoNews'
})
export class FilterEcoNewsPipe implements PipeTransform {

  transform(ecoNewsArray: Array<EcoNewsModel>, newsFilter: Array<string>): Array<EcoNewsModel> {
    if (newsFilter.length !== 0) {
      return ecoNewsArray.filter((elem: EcoNewsModel) => newsFilter.includes(elem.tag));
    } else {
      return ecoNewsArray;
    }
  }

}
