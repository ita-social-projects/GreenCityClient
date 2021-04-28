import { WeekDays } from './weekDays.model';
import { BreakTimes } from './breakTimes.model';

export class OpeningHours {
  openTime: string;
  closeTime: string;
  weekDay: WeekDays;
  breakTime: BreakTimes;
}
