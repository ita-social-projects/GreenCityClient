import {Component, Input, OnInit} from '@angular/core';
import {HabitStatisticService} from '../../../../../../service/habit-statistic/habit-statistic.service';
import {DayEstimation} from '../../../../../../model/habit/DayEstimation';
import {HabitStatisticDto} from '../../../../../../model/habit/HabitStatisticDto';

@Component({
  selector: 'app-day-estimation',
  templateUrl: './day-estimation.component.html',
  styleUrls: ['./day-estimation.component.css']
})
export class DayEstimationComponent implements OnInit {
  @Input()
  habitStatisticDto: HabitStatisticDto;
  estimation: DayEstimation;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
  }

  update(estimation: string) {
    this.service.updateHabitStatistic(new HabitStatisticDto(this.habitStatisticDto.id, this.habitStatisticDto.habitId,
      this.habitStatisticDto.countHabit, DayEstimation[estimation], this.habitStatisticDto.date)).subscribe(response => {
      this.estimation = response.dayEstimation;
    });
  }
}
