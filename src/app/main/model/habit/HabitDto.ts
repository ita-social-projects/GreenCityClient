import { HabitStatisticsDto } from './HabitStatisticsDto';
import { HabitDictionaryDto } from './HabitDictionaryDto';
import { Injector } from '@angular/core';

export class HabitDto {
  public createDate: Date;
  public habitDictionary: HabitDictionaryDto;

  constructor(
    private inject: Injector,
    public id: number,
    public name: string,
    public status: boolean,
    public description: string,
    public image: string,
    public habitStatistics: HabitStatisticsDto[]
  ) {
    this.createDate = inject.get(Date);
    this.habitDictionary = inject.get(HabitDictionaryDto);
  }
}
