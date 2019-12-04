import { HabitStatisticsDto } from './HabitStatisticsDto';

export class HabitDto {
  id: number;
  name: string;
  status: boolean;
  description: string;
  createDate: Date;
  habitStatistics: HabitStatisticsDto[];

  constructor(id: number, name: string, status: boolean, description: string, createDate: Date, habitStatistics: HabitStatisticsDto[]) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.description = description;
    this.createDate = createDate;
    this.habitStatistics = habitStatistics;
  }
}
