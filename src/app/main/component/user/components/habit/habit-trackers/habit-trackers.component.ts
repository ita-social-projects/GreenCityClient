import { Component, OnInit } from '@angular/core';
import { HabitStatisticService } from '@global-service/habit-statistic/habit-statistic.service';
import { HabitDto } from '@global-models/habit/HabitDto';
import { Observable } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-habit-trackers',
  templateUrl: './habit-trackers.component.html',
  styleUrls: ['./habit-trackers.component.scss']
})
export class HabitTrackersComponent implements OnInit {
  $trackedHabits: Observable<HabitDto[]>;
  trackedHabits: HabitDto[];

  constructor(private service: HabitStatisticService, private languageService: LanguageService) {}

  ngOnInit() {
    this.service.loadHabitStatistics(this.languageService.getCurrentLanguage());
    this.$trackedHabits = this.service.habitStatistics;
    this.$trackedHabits.subscribe((data) => {
      data = data.filter((i) => i.status !== undefined);
      this.trackedHabits = data;
    });
  }
}
