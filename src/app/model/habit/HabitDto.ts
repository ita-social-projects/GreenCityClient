import {HabitStatisticsDto} from './HabitStatisticsDto';

export class HabitDto {
  id: number;
  habitName: string;
  createDate: Date;
  habitStatistics: HabitStatisticsDto[];

  constructor(id: number, habitName: string, createDate: Date, habitStatistics: HabitStatisticsDto[]) {
    this.id = id;
    this.habitName = habitName;
    this.createDate = createDate;
    this.habitStatistics = habitStatistics;
  }
}
