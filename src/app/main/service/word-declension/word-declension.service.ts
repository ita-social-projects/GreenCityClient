import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordDeclensionService {
  setWordDeclension(count: string): string {
    const lastOne = -1;
    const lastTwo = -2;
    const suitableLastNumber = '1';
    const unsuitableLastNumber = '11';
    const suitableLastNumbers = '234';
    const unsuitableLastNumbers = ['12', '13', '14'];
    if (count.slice(lastOne) === suitableLastNumber && count.slice(lastTwo) !== unsuitableLastNumber) {
      return 'a';
    }
    if (suitableLastNumbers.includes(count.slice(lastOne)) && !unsuitableLastNumbers.includes(count.slice(lastTwo))) {
      return 'b';
    }
    return '';
  }
}
