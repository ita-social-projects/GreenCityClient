export interface CalendarWeekInterface extends BaseCalendar {
  isCurrent: boolean;
}

export interface BaseCalendar {
  date: Date;
  dayName: string;
  hasHabitsInProgress: boolean;
  areHabitsDone: boolean;
}
