import {Component, Input, OnInit} from '@angular/core';
import {DayEstimation} from '../../../../../../../model/habit/DayEstimation';
import {HabitStatisticsDto} from '../../../../../../../model/habit/HabitStatisticsDto';
import {HabitStatisticService} from '../../../../../../../service/habit-statistic/habit-statistic.service';
import {HabitDto} from '../../../../../../../model/habit/HabitDto';

@Component({
  selector: 'app-day-estimation',
  templateUrl: './day-estimation.component.html',
  styleUrls: ['./day-estimation.component.css']
})
export class DayEstimationComponent implements OnInit {
  @Input()
  habitStatisticDto: HabitStatisticsDto;
  @Input()
  habit: HabitDto;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    console.log('habit');
    console.log(this.habitStatisticDto);
    console.log(this.habit);
  }

  update(estimation: string) {
    console.log('habit update');
    console.log(this.habitStatisticDto);
    console.log(this.habit);

    const stat: HabitStatisticsDto =
      new HabitStatisticsDto(this.habitStatisticDto.id,
        DayEstimation[estimation],
        this.habitStatisticDto.createdOn,
        this.habitStatisticDto.amountOfItems,
        this.habit.id);

    if (this.habitStatisticDto.id === null) {
      console.log('hello');
      this.create(stat);
    } else {
      this.service.updateHabitStatistic(stat);
    }
  }

  create(habitStatistic: HabitStatisticsDto) {
    this.service.createHabitStatistic(habitStatistic);
  }
}
