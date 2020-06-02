import {Component, Input, OnInit} from '@angular/core';
import {HabitDto} from '../../../../../../../model/habit/HabitDto';
import {HabitStatisticsDto} from '../../../../../../../model/habit/HabitStatisticsDto';

@Component({
  selector: 'app-habit-estimation',
  templateUrl: './habit-estimation.component.html',
  styleUrls: ['./habit-estimation.component.scss']
})
export class HabitEstimationComponent implements OnInit {
  @Input()
  habit: HabitDto;
  @Input()
  statistic: HabitStatisticsDto;

  constructor() {
  }

  ngOnInit() {
  }

}
