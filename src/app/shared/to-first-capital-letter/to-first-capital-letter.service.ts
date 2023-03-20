import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToFirstCapitalLetterService {
  public convFirstLetterToCapital(value: string): string {
    const lowerCaseVal = value.toLocaleLowerCase();
    const converted = lowerCaseVal.charAt(0).toUpperCase() + lowerCaseVal.slice(1);
    return converted;
  }
}
