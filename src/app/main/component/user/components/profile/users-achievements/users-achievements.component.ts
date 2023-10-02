import { Component, Input } from '@angular/core';
import { PROFILE_IMAGES } from 'src/app/main/image-pathes/profile-images';

@Component({
  selector: 'app-users-achievements',
  templateUrl: './users-achievements.component.html',
  styleUrls: ['./users-achievements.component.scss']
})
export class UsersAchievementsComponent {
  public achievementsImages = PROFILE_IMAGES.achs;
  @Input() currLang: string;
}
