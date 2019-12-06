import {HabitStatisticsDto} from './HabitStatisticsDto';
import {HabitDictionaryDto} from './HabitDictionaryDto';

export class HabitDto {

  constructor(public id: number,
              public name: string,
              public status: boolean,
              public description: string,
              public createDate: Date,
              public habitStatistics: HabitStatisticsDto[],
              public habitDictionary: HabitDictionaryDto) {
  }
}
