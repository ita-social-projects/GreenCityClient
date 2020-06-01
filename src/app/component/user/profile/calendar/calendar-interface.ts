export interface CalendarInterface {
  date: Date;
  numberOfDate: number | string;
  year: number;
  month: number;
  firstDay: number;
  dayName: string;
  totalDaysInMonth: number;
  isHabitsTracked: boolean;
  isCurrentDayActive: boolean;
}
