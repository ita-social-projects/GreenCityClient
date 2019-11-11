import {DayEstimation} from './DayEstimation';

export class DayEstimationDto {
  habitName: string;
  estimation: DayEstimation;
  dayNumber: number;

  constructor(habitName: string, estimation: DayEstimation, dayNumber: number) {
    this.habitName = habitName;
    this.estimation = estimation;
    this.dayNumber = dayNumber;
  }
}
