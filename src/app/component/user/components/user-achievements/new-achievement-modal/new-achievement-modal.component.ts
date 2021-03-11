import { Component, OnInit, Input } from '@angular/core';
import { AchievementDto } from 'src/app/model/achievement/AchievementDto';

@Component({
  selector: 'app-new-achievement-modal',
  templateUrl: './new-achievement-modal.component.html',
  styleUrls: ['./users-achievements.component.scss'],
})
export class NewAchievementModalComponent implements OnInit {
  @Input() achievement: AchievementDto;
  @Input() visible: boolean;

  readonly achieve = 'assets/img/achieve.png';
  constructor() {}
  ngOnInit() {}

  hideAchievementModal() {
    this.visible = false;
  }
}
