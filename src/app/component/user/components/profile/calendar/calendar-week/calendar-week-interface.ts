export interface CalendarWeekInterface {
  date: Date;
  numberOfDate: number | string;
  year: number;
  month: number;
  firstDay: number;
  lastDayInWeek: number;
  dayName: string;
  totalDaysInMonth: number;
  isHabitsTracked: boolean;
  isCurrentDayActive: boolean;
}
