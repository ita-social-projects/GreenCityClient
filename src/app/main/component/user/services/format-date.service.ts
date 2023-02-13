import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormatDateService {
  public formatDate(date: string): string {
    return moment(date).format('YYYY-MM-DD');
  }
}
