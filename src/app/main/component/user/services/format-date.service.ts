import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatDateService {
  constructor() {}

  public formatDate(date: string): string {
    const dateArr = date.split('/');
    return [dateArr[2], dateArr[0].length < 2 ? '0' + dateArr[0] : dateArr[0], dateArr[1].length < 2 ? '0' + dateArr[1] : dateArr[1]].join(
      '-'
    );
  }
}
