import {HabitStatisticsDto} from './HabitStatisticsDto';

export class HabitDto {
  id: number;
  habitName: string;
  habitItem: string;
  createDate: Date;
  habitStatistics: HabitStatisticsDto[];

  constructor(id: number, habitName: string, habitItem: string, createDate: Date, habitStatistics: HabitStatisticsDto[]) {
    this.id = id;
    this.habitName = habitName;
    this.habitItem = habitItem;
    this.createDate = createDate;
    this.habitStatistics = habitStatistics;
  }
}
