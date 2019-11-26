import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HabitDto} from '../../../../../model/habit/HabitDto';
import {HabitStatisticService} from '../../../../../service/habit-statistic/habit-statistic.service';
import {map} from 'rxjs/operators';
import {HabitStatisticsDto} from '../../../../../model/habit/HabitStatisticsDto';

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.css']
})
export class HabitTrackerComponent implements OnInit {
  @Input()
  habit: HabitDto;
  @Input()
  chartId: string;
  $habit: Observable<HabitDto>;
  currentStatistic: HabitStatisticsDto;
  habitStatistic: HabitStatisticsDto[];
  chartRedrawTrigger: boolean;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.initCurrentStatistic();
    this.$habit = this.service.habitStatistics.pipe(map(habit => habit.find(item => item.id === this.habit.id)));

    this.$habit.subscribe(data => {
      this.chartRedrawTrigger = !this.chartRedrawTrigger;
      this.habitStatistic = data.habitStatistics;
    });
  }

  initCurrentStatistic() {
    const today: Date = new Date();

    this.currentStatistic = this.habit.habitStatistics.filter(stat => this.compareDates(today, stat.createdOn))[0];
  }

  compareDates(a: Date, b: Date): boolean {
    return new Date(a).getFullYear() === new Date(b).getFullYear() &&
      new Date(a).getMonth() === new Date(b).getMonth() &&
      new Date(a).getDate() === new Date(b).getDate();
  }
}
