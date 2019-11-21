import {Component, Input, OnInit} from '@angular/core';
import {HabitDto} from '../../../../../model/habit/HabitDto';
import {HabitStatisticsDto} from '../../../../../model/habit/HabitStatisticsDto';
import {HabitStatisticService} from '../../../../../service/habit-statistic/habit-statistic.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.css']
})
export class HabitTrackerComponent implements OnInit {
  @Input()
  habit: HabitDto;
  @Input() chartId: string;
  @Input()
  habitStatistic: HabitStatisticsDto[];
  currentStatistic: HabitStatisticsDto;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.initCurrentStatistic();
  }

  initCurrentStatistic() {
    const today: Date = new Date();

    this.currentStatistic = this.habitStatistic.filter(stat => this.compareDates(today, stat.createdOn))[0];
  }

  compareDates(a: Date, b: Date): boolean {
    return new Date(a).getFullYear() === new Date(b).getFullYear() &&
      new Date(a).getMonth() === new Date(b).getMonth() &&
      new Date(a).getDate() === new Date(b).getDate();
  }
}
