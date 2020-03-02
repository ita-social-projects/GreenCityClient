import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEcoNews'
})
export class FilterEcoNewsPipe implements PipeTransform {

  transform(ecoNewsArray: any, newsFilter:Array<string>): any { 
    if(newsFilter.length!==0){
      return ecoNewsArray.filter(elem=>newsFilter.includes(elem.tag));
    }else{
      return ecoNewsArray;
    }
    
   
    
  }

}
