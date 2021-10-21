import { HabitStatisticsDto } from '@global-models/habit/HabitStatisticsDto';
import { HabitDictionaryDto } from '@global-models/habit/HabitDictionaryDto';
import { Injector } from '@angular/core';

export class HabitDto {
  public createDate: Date;
  public habitDictionary: HabitDictionaryDto;

  constructor(
    public habitStatistics: HabitStatisticsDto[],
    public id: number,
    public name: string,
    public status: boolean,
    public description: string,
    public image: string,
    private injector: Injector
  ) {
    this.createDate = injector.get(Date);
    this.habitDictionary = injector.get(HabitDictionaryDto);
  }
}
