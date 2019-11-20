import {Component, Input, OnInit} from '@angular/core';
import {HabitStatisticDto} from '../../../../../model/habit/HabitStatisticDto';
import {HabitDto} from '../../../../../model/habit/HabitDto';
import {HabitStatisticService} from '../../../../../service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.css']
})
export class HabitTrackerComponent implements OnInit {
  @Input()
  habit: HabitDto;
  @Input() chartId: string;

  habitStatistic: HabitStatisticDto[];
  currentStatistic: HabitStatisticDto;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.service.getHabitStatistic(this.habit).subscribe(habitStatistic => {
      this.habitStatistic = habitStatistic;
      this.sortStatistic();

      this.habitStatistic = this.fillStatistic(this.habitStatistic);

      this.sortStatistic();

      this.currentStatistic = habitStatistic[habitStatistic.length - 1];
    });
  }

  sortStatistic() {
    this.habitStatistic.sort((a, b) =>
      new Date(a.createdOn) > new Date(b.createdOn) ? 1 : new Date(a.createdOn) === new Date(b.createdOn) ? 0 : -1);
  }

  fillStatistic(habitStatistic: HabitStatisticDto[]) {
    const period: Date[] = [];
    period.push(new Date(this.habit.createDate));

    for (let i = 1; i < 21; i++) {
      const previous = new Date(period[i - 1]);
      const current = new Date(previous.setDate(previous.getDate() + 1));
      period.push(current);
    }

    const result: HabitStatisticDto[] = [];
    for (let i = 0; i < 21; i++) {
      if (habitStatistic[i] === undefined || habitStatistic[i].createdOn > period[i]) {
        result.push(new HabitStatisticDto(null, null, 0, null, period[i]));
      } else {
        result.push(habitStatistic[i]);
      }
    }

    return result;
  }
}
