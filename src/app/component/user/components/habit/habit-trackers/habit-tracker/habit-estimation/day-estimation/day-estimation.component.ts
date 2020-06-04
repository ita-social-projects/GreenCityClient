import {Component, Input, OnInit} from '@angular/core';
import {HabitDto} from '../../../../../../../../model/habit/HabitDto';
import {HabitStatisticsDto} from '../../../../../../../../model/habit/HabitStatisticsDto';
import {HabitStatisticService} from '../../../../../../../../service/habit-statistic/habit-statistic.service';
import {DayEstimation} from '../../../../../../../../model/habit/DayEstimation';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-day-estimation',
  templateUrl: './day-estimation.component.html',
  styleUrls: ['./day-estimation.component.scss']
})
export class DayEstimationComponent implements OnInit {
  @Input()
  habitDto: HabitDto;
  @Input()
  habitStatisticsDto: HabitStatisticsDto;
  dayEstimation: DayEstimation;

  constructor(private habitStatisticService: HabitStatisticService) {
  }

  ngOnInit() {
    this.habitStatisticService.habitStatistics
      .pipe(
        map(habit => habit.find(item => item.id === this.habitDto.id)),
        filter(habit => habit !== undefined),
      )
      .subscribe((data: HabitDto) => {
        const stat = this.habitStatisticService.getHabitStatisticsDto(this.habitStatisticsDto, data);
        this.habitStatisticsDto = stat;
        this.dayEstimation = stat.habitRate;
    });
  }

  update(estimation: string) {
    const newEstimation = Object.assign({}, this.habitStatisticsDto);
    newEstimation.habitRate = DayEstimation[estimation];
    newEstimation.habitId = this.habitDto.id;

    if (newEstimation.id === null) {
      this.create(newEstimation);
    } else {
      this.habitStatisticService.updateHabitStatistic(newEstimation);
    }
  }

  create(habitStatistic: HabitStatisticsDto) {
    this.habitStatisticService.createHabitStatistic(habitStatistic);
  }
}
