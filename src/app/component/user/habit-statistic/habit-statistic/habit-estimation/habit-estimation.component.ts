import {Component, Input, OnInit} from '@angular/core';
import {Photo} from '../../../../../model/photo/Photo';
import {HabitDto} from '../../../../../model/habit/HabitDto';
import {HabitStatisticDto} from '../../../../../model/habit/HabitStatisticDto';
import {HabitStatisticService} from '../../../../../service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-habit-estimation',
  templateUrl: './habit-estimation.component.html',
  styleUrls: ['./habit-estimation.component.css']
})
export class HabitEstimationComponent implements OnInit {
  @Input()
  habitStatistic: HabitStatisticDto;
  @Input()
  habit: HabitDto;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
  }

  getIcon(): Photo {
    return {name: `assets/img/icon/${this.habit.name}.png`};
  }
}
