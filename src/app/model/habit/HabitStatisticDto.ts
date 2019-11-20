import {DayEstimation} from './DayEstimation';

export class HabitStatisticDto {
  id: number;
  habitId: number;
  amountOfItems: number;
  habitRate: DayEstimation;
  createdOn: Date;

  constructor(id: number, habitId: number, amountOfItems: number, dayEstimation: DayEstimation, date: Date) {
    this.id = id;
    this.habitId = habitId;
    this.amountOfItems = amountOfItems;
    this.habitRate = dayEstimation;
    this.createdOn = date;
  }
}
