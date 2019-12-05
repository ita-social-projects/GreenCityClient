import {HabitStatisticsDto} from './HabitStatisticsDto';
import {HabitDictionaryDto} from './HabitDictionaryDto';

export class HabitDto {
  id: number;
  habitName: string;
  habitItem: string;
  createDate: Date;
  habitStatistics: HabitStatisticsDto[];
  habitDictionary: HabitDictionaryDto;

  constructor(id: number, habitName: string, habitItem: string, createDate: Date, habitStatistics: HabitStatisticsDto[],
              habitDictionary: HabitDictionaryDto) {
    this.id = id;
    this.habitName = habitName;
    this.habitItem = habitItem;
    this.createDate = createDate;
    this.habitStatistics = habitStatistics;
    this.habitDictionary = habitDictionary;
  }
}
