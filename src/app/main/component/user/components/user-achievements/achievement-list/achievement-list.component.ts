import { Component, OnInit } from '@angular/core';
import { AchievementService } from '../../../../../service/achievement/achievement.service';

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.component.html',
  styleUrls: ['./achievement-list.component.scss']
})
export class AchievementListComponent implements OnInit {
  $achievements: any;

  constructor(private achievementService: AchievementService) {}

  ngOnInit() {
    this.achievementService.loadAchievements();
    this.$achievements = this.achievementService.achievements;
  }
}
