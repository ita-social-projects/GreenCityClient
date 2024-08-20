import { BaseCalendar } from '@global-user/components/profile/calendar/calendar-week/calendar-week-interface';

export interface CalendarInterface extends BaseCalendar {
  firstDay: number;
  totalDaysInMonth: number;
  isCurrentDayActive: boolean;
}
