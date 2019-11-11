import {Component, Input, OnInit} from '@angular/core';
import {HabitStatisticService} from '../../../../service/habit-statistic/habit-statistic.service';
import {DayEstimation} from '../../../../model/habit/DayEstimation';
import {DayEstimationDto} from '../../../../model/habit/DayEstimationDto';

@Component({
  selector: 'app-day-estimation',
  templateUrl: './day-estimation.component.html',
  styleUrls: ['./day-estimation.component.css']
})
export class DayEstimationComponent implements OnInit {
  @Input()
  habitName: string;
  @Input()
  dayNumber: number;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
  }

  update(estimation: string) {
    this.service.updateDayEstimation(new DayEstimationDto(this.habitName, DayEstimation[estimation], this.dayNumber));
  }
}
