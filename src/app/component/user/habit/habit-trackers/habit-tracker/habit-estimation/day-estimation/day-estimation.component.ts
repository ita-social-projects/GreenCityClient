import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DayEstimation} from '../../../../../../../model/habit/DayEstimation';
import {HabitStatisticDto} from '../../../../../../../model/habit/HabitStatisticDto';
import {HabitStatisticService} from '../../../../../../../service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-day-estimation',
  templateUrl: './day-estimation.component.html',
  styleUrls: ['./day-estimation.component.css']
})
export class DayEstimationComponent implements OnInit, OnChanges {
  @Input()
  habitStatisticDto: HabitStatisticDto;
  estimation: DayEstimation;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
  }

  update(estimation: string) {
    this.service.updatedHabitStatistic(new HabitStatisticDto(this.habitStatisticDto.id, this.habitStatisticDto.habitId,
      this.habitStatisticDto.countHabit, DayEstimation[estimation], this.habitStatisticDto.date)).subscribe(response => {
      this.estimation = response.dayEstimation;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.estimation = this.habitStatisticDto.dayEstimation;
  }
}
