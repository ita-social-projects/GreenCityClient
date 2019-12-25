import {Component, Input, OnInit} from '@angular/core';
import {HabitDto} from '../../../../../../../model/habit/HabitDto';
import {HabitStatisticsDto} from '../../../../../../../model/habit/HabitStatisticsDto';
import {HabitStatisticService} from '../../../../../../../service/habit-statistic/habit-statistic.service';
import {DayEstimation} from '../../../../../../../model/habit/DayEstimation';
import {Observable, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-day-estimation',
  templateUrl: './day-estimation.component.html',
  styleUrls: ['./day-estimation.component.css']
})
export class DayEstimationComponent implements OnInit {
  @Input()
  habit: HabitDto;
  @Input()
  statistic: HabitStatisticsDto;
  $habit: Observable<HabitDto> = of<HabitDto>();
  estimation: DayEstimation;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.service.habitStatistics
      .pipe(
        map(habit => habit.find(item => item.id === this.habit.id)),
        filter(habit => habit !== undefined)
      )
      .subscribe(data => {
        let stat: HabitStatisticsDto;
        if (this.statistic.id === null) {
          stat = data.habitStatistics.find(el => {
            const a = new Date(el.createdOn);
            const b = new Date(this.statistic.createdOn);
            return a.getFullYear() === b.getFullYear()
              && a.getMonth() === b.getMonth()
              && a.getDay() === a.getDay();
          });
        } else {
          stat = data.habitStatistics.find(el => el.id === this.statistic.id);
        }
        this.statistic = stat;
        this.estimation = stat.habitRate;
    });
  }

  update(estimation: string) {
    const newEstimation = Object.assign({}, this.statistic);
    newEstimation.habitRate = DayEstimation[estimation];
    newEstimation.habitId = this.habit.id;

    if (newEstimation.id === null) {
      this.create(newEstimation);
    } else {
      this.service.updateHabitStatistic(newEstimation);
    }
  }

  create(habitStatistic: HabitStatisticsDto) {
    this.service.createHabitStatistic(habitStatistic);
  }
}
