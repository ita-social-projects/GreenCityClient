import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {HabitDto} from '../../../../../../model/habit/HabitDto';
import {HabitStatisticDto} from '../../../../../../model/habit/HabitStatisticDto';
import {HabitStatisticService} from '../../../../../../service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-habit-estimation',
  templateUrl: './habit-estimation.component.html',
  styleUrls: ['./habit-estimation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
}
