import { Component, OnInit } from '@angular/core';
import { AchievementService } from 'src/app/service/achievement/achievement.service';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/service/localstorage/local-storage.service';

@Component({
  selector: 'app-user-habit-page',
  templateUrl: './user-habit-page.component.html',
  styleUrls: ['./user-habit-page.component.css']
})
export class UserHabitPageComponent implements OnInit {

  constructor(private achievementService: AchievementService, private localStorageService: LocalStorageService) { }

  $achievement: Observable<any>;
  achievement;
  achievementVisible: boolean;

  ngOnInit() {
    this.achievementService.loadAchievements();
    this.achievementService.achievements.subscribe(data => {
      this.achievement = data[0];
    });
    if (this.localStorageService.getFirstSighIn()) {
      setTimeout(() => {
        this.achievement === undefined ? this.achievementVisible = false : this.achievementVisible = true;
      }, 500);
    }
  }
}
