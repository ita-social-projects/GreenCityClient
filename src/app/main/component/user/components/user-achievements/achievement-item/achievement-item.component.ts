import { Component, Input } from '@angular/core';
import { AchievementDto } from '../../../../../model/achievement/AchievementDto';

@Component({
  selector: 'app-achievement-item',
  templateUrl: './achievement-item.component.html',
  styleUrls: ['./achievement-item.component.scss']
})
export class AchievementItemComponent {
  @Input() achievement: AchievementDto;
  readonly achieve = 'assets/img/achieve.png';
}
