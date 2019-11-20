import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DayEstimation} from '../../../../../../../model/habit/DayEstimation';
import {HabitStatisticDto} from '../../../../../../../model/habit/HabitStatisticDto';
import {HabitStatisticService} from '../../../../../../../service/habit-statistic/habit-statistic.service';
import {HabitDto} from '../../../../../../../model/habit/HabitDto';

@Component({
  selector: 'app-day-estimation',
  templateUrl: './day-estimation.component.html',
  styleUrls: ['./day-estimation.component.css']
})
export class DayEstimationComponent implements OnInit, OnChanges {
  @Input()
  habitStatisticDto: HabitStatisticDto;
  @Input()
  habit: HabitDto;
  estimation: DayEstimation;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.service.getHabitStatistic(this.habit).subscribe(response => {
      this.estimation = response.filter(stat => stat.id === this.habitStatisticDto.id)[0].habitRate;
      this.habitStatisticDto.habitRate = response.filter(stat => stat.id === this.habitStatisticDto.id)[0].habitRate;
    });
    this.estimation = this.habitStatisticDto.habitRate;
  }

  update(estimation: string) {
    this.service.updatedHabitStatistic(new HabitStatisticDto(this.habitStatisticDto.id, this.habitStatisticDto.habitId,
      this.habitStatisticDto.amountOfItems, DayEstimation[estimation], this.habitStatisticDto.createdOn)).subscribe(response => {
      this.estimation = DayEstimation[response.habitRate];
      this.habitStatisticDto.habitRate = response.habitRate;
      console.log(this.estimation);
    });
    this.estimation = DayEstimation[estimation];
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
}
