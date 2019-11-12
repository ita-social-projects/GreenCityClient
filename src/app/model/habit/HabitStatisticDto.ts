import {DayEstimation} from './DayEstimation';

export class HabitStatisticDto {
  habitId: number;
  habitName: string;
  countHabit: number;
  dayEstimation: DayEstimation;
  date: Date;

  constructor(habitId: number, habitName: string, countHabit: number, dayEstimation: DayEstimation, date: Date) {
    this.habitId = habitId;
    this.habitName = habitName;
    this.countHabit = countHabit;
    this.dayEstimation = dayEstimation;
    this.date = date;
  }
}
