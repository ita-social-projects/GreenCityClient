import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEcoNews'
})
export class FilterEcoNewsPipe implements PipeTransform {

  transform(ecoNewsArray: any, newsFilter:Array<string>): any {
    if(newsFilter.length===1){
      return ecoNewsArray.filter(elem=>elem.tag);
    }else{
   return ecoNewsArray.filter(elem=>elem.tag.includes(newsFilter))
    }
  }

}
