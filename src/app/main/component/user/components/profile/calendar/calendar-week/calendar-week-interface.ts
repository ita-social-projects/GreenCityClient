export interface CalendarWeekInterface extends BaseCalendar {
  isCurrent: boolean;
}

export interface BaseCalendar {
  numberOfDate: number;
  date: Date;
  dayName: string;
  hasHabitsInProgress: boolean;
  areHabitsDone: boolean;
}
