import { DayEstimation } from './DayEstimation';

export class HabitStatisticsDto {
  id: number;
  habitRate: DayEstimation;
  createdOn: Date;
  amountOfItems: number;
  habitId: number;

  constructor(id: number, habitRate: DayEstimation, createdOn: Date, amountOfItems: number, habitId: number) {
    this.id = id;
    this.habitRate = habitRate;
    this.createdOn = createdOn;
    this.amountOfItems = amountOfItems;
    this.habitId = habitId;
  }
}
