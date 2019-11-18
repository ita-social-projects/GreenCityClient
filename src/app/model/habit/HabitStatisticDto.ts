import {DayEstimation} from './DayEstimation';

export class HabitStatisticDto {
  id: number;
  habitId: number;
  countHabit: number;
  dayEstimation: DayEstimation;
  date: Date;

  constructor(id: number, habitId: number, countHabit: number, dayEstimation: DayEstimation, date: Date) {
    this.id = id;
    this.habitId = habitId;
    this.countHabit = countHabit;
    this.dayEstimation = dayEstimation;
    this.date = date;
  }
}
