import { Component, Input } from '@angular/core';
import { AchievementDto } from 'src/app/main/model/achievement/AchievementDto';

@Component({
  selector: 'app-new-achievement-modal',
  templateUrl: './new-achievement-modal.component.html',
  styleUrls: ['./users-achievements.component.scss']
})
export class NewAchievementModalComponent {
  @Input() achievement: AchievementDto;
  @Input() visible: boolean;

  readonly achieve = 'assets/img/achieve.png';

  hideAchievementModal() {
    this.visible = false;
  }
}
