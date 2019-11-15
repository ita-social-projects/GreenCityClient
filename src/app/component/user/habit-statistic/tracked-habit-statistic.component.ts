import {Component, OnInit} from '@angular/core';
import {HabitStatisticService} from '../../../service/habit-statistic/habit-statistic.service';
import {HabitStatisticDto} from '../../../model/habit/HabitStatisticDto';
import {DayEstimation} from '../../../model/habit/DayEstimation';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-tracked-habit-statistic',
  templateUrl: './tracked-habit-statistic.component.html',
  styleUrls: ['./tracked-habit-statistic.component.css']
})
export class TrackedHabitStatisticComponent implements OnInit {
  activePackageIcon = {name: 'assets/img/icon/package.png'};
  activeCoffeeIcon = {name: 'assets/img/icon/coffee.png'};

  packageStatisticDto: HabitStatisticDto;
  cupStatisticDto: HabitStatisticDto;

  packageAdvice: Observable<string>;
  cupAdvice: Observable<string>;

  packageMessage: Observable<string>;
  cupMessage: Observable<string>;

  constructor(private service: HabitStatisticService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.service.getTrackedHabits().subscribe(data => {
      this.packageStatisticDto = data[0];
      this.cupStatisticDto = data[1];
    });

    this.packageAdvice = this.translate.get('advice.package-advice');
    this.cupAdvice = this.translate.get('advice.cup-advice');
    this.packageMessage = this.translate.get('habit-message.package');
    this.cupMessage = this.translate.get('habit-message.cup');
  }
}
