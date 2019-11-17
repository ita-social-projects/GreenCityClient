import {Component, OnInit} from '@angular/core';
import {HabitStatisticService} from '../../../../../service/habit-statistic/habit-statistic.service';
import {HabitDto} from '../../../../../model/habit/HabitDto';

@Component({
  selector: 'app-tracked-habit-statistic',
  templateUrl: './tracked-habit-statistic.component.html',
  styleUrls: ['./tracked-habit-statistic.component.css']
})
export class TrackedHabitStatisticComponent implements OnInit {
  trackedHabits: HabitDto[];

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.service.getTrackedHabits().subscribe(trackedHabits => {
      this.trackedHabits = trackedHabits;
    });
  }
}
