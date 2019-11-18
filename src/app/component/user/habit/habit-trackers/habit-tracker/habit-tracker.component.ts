import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Photo } from '../../../../../model/photo/photo';
import { HabitStatisticDto } from '../../../../../model/habit/HabitStatisticDto';
import { Observable } from 'rxjs';
import { HabitDto } from '../../../../../model/habit/HabitDto';
import { HabitStatisticService } from '../../../../../service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.css']
})
export class HabitTrackerComponent implements OnInit {
  @Input()
  habit: HabitDto;
  habitValues = [
    { value: 4, estimation: 2 },
    { value: 5, estimation: 2 },
    { value: 5, estimation: 2 },
    { value: 5, estimation: 1 },
    { value: 9, estimation: 3 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 },
    { value: 0, estimation: 0 }
  ];

  habitStatistic: HabitStatisticDto[];
  currentStatistic: HabitStatisticDto;

  constructor(private service: HabitStatisticService) {}

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
