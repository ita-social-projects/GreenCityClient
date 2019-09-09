import {WeekDays} from './weekDays.model';

export class OpeningHours {
 private _openTime: string;
 private _closeTime: string;
  private _weekDay: WeekDays;



  constructor() {
  }


  get openTime(): string {
    return this._openTime;
  }

  set openTime(value: string) {
    this._openTime = value;
  }

  get closeTime(): string {
    return this._closeTime;
  }

  set closeTime(value: string) {
    this._closeTime = value;
  }

  get weekDay(): WeekDays {
    return this._weekDay;
  }

  set weekDay(value: WeekDays) {
    this._weekDay = value;
  }
}
