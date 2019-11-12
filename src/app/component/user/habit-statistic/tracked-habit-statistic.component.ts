import {Component, OnInit} from '@angular/core';
import {HabitStatisticService} from '../../../service/habit-statistic/habit-statistic.service';
import {HabitStatisticDto} from '../../../model/habit/HabitStatisticDto';
import {DayEstimation} from '../../../model/habit/DayEstimation';

@Component({
  selector: 'app-tracked-habit-statistic',
  templateUrl: './tracked-habit-statistic.component.html',
  styleUrls: ['./tracked-habit-statistic.component.css']
})
export class TrackedHabitStatisticComponent implements OnInit {
  activePackageIcon = {name: 'assets/img/icon/package.png'};
  activeCoffeeIcon = {name: 'assets/img/icon/coffee.png'};

  packageStatisticDto: HabitStatisticDto;
  coffeeStatisticDto: HabitStatisticDto;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.service.getTrackedHabits().subscribe(data => {
      this.packageStatisticDto = data[0];
      this.coffeeStatisticDto = data[1];
    });
  }

}
