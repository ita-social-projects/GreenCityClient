export interface CalendarWeekInterface extends BaseCalendar {
  isCurrent: boolean;
}

export interface BaseCalendar {
  year: number;
  month: number;
  numberOfDate: number;
  date: Date;
  dayName: string;
  isMissed?: boolean;
  hasHabitsInProgress: boolean;
  areHabitsDone: boolean;
}
