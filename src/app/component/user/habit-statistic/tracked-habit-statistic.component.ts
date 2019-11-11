import {Component, Input, OnInit} from '@angular/core';
import {Photo} from '../../../model/photo/photo';
import {HabitItem} from './habit-item/HabitItem';
import {HabitStatisticService} from '../../../service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-tracked-habit-statistic',
  templateUrl: './tracked-habit-statistic.component.html',
  styleUrls: ['./tracked-habit-statistic.component.css']
})
export class TrackedHabitStatisticComponent implements OnInit {
  activePackageIcon = {name: 'assets/img/icon/active-package.png'};
  activeCoffeeIcon = {name: 'assets/img/icon/active-coffee.png'};

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
  }

}
