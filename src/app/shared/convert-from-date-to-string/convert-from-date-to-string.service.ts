import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertFromDateToStringService {
  public toISOStringWithTimezoneOffset(date: Date): string {
    const parseDate = Date.parse(date.toString());
    let diff: number;
    try {
      diff = date.getTimezoneOffset();
    } catch {
      diff = 0;
    }
    return new Date(parseDate - diff * 60 * 1000).toISOString().slice(0, 10);
  }
}
