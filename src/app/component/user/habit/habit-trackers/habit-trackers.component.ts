import {Component, OnInit} from '@angular/core';
import {HabitStatisticService} from '../../../../service/habit-statistic/habit-statistic.service';
import {HabitDto} from '../../../../model/habit/HabitDto';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-habit-trackers',
  templateUrl: './habit-trackers.component.html',
  styleUrls: ['./habit-trackers.component.css']
})
export class HabitTrackersComponent implements OnInit {
  $trackedHabits: Observable<HabitDto[]>;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.$trackedHabits = this.service.habitStatistics;
    this.service.loadHabitStatistics();
  }
}
