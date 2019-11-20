import {Component, OnInit} from '@angular/core';
import {HabitStatisticService} from '../../../../service/habit-statistic/habit-statistic.service';
import {HabitDto} from '../../../../model/habit/HabitDto';

@Component({
  selector: 'app-habit-trackers',
  templateUrl: './habit-trackers.component.html',
  styleUrls: ['./habit-trackers.component.css']
})
export class HabitTrackersComponent implements OnInit {
  trackedHabits: HabitDto[];

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit() {
    this.service.getTrackedHabits().subscribe(trackedHabits => {
      this.trackedHabits = trackedHabits;
      console.log(trackedHabits);
    });
  }
}
