import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Photo} from '../../../../../../model/photo/Photo';
import {HabitStatisticDto} from '../../../../../../model/habit/HabitStatisticDto';
import {Observable} from 'rxjs';
import {HabitDto} from '../../../../../../model/habit/HabitDto';
import {HabitStatisticService} from '../../../../../../service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-habit-statistic',
  templateUrl: './habit-statistic.component.html',
  styleUrls: ['./habit-statistic.component.css']
})
export class HabitStatisticComponent implements OnInit {
  @Input()
  habit: HabitDto;

  habitStatistic: HabitStatisticDto[];
  currentStatistic: HabitStatisticDto;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.service.getHabitStatistic(this.habit).subscribe(habitStatistic => {
      this.habitStatistic = habitStatistic;

      // stub
      this.currentStatistic = habitStatistic[0];
    });
  }

  changeCurrentStatistic(statistic: HabitStatisticDto) {
    this.currentStatistic = statistic;
  }
}
